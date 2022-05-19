import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import { VAULTS } from '../../data/vaults';
import { ERC20 } from 'src/lib/types/classes/erc20';
import { IVault } from 'src/lib/types/vault.types';
import { awaitTransactionComplete } from 'src/lib/utils/web3-utils';
import { StatsService } from '../stats/stats.service';
import { Web3Service } from '../web3.service';
import { Strategy } from '../../types/classes/Strategy';
import { Pair } from '../../types/classes/pair';
import { formatEther } from 'ethers/lib/utils';
import { VAULT_ABI } from 'src/lib/abis/vault-abi';

@Injectable({ providedIn: 'root' })
export class VaultService {
  private _init = new BehaviorSubject<boolean>(false);
  get init() {
    return this._init.asObservable();
  }

  private _vaults = new BehaviorSubject<IVault[]>([]);
  get vaults() {
    return this._vaults.asObservable();
  }

  private _operationActive = new Subject<string>();
  get operationActive() {
    return this._operationActive.asObservable();
  }

  private _error = new Subject<Error>();
  get error() {
    return this._error.asObservable();
  }

  constructor(
    private readonly web3: Web3Service,
    private readonly statService: StatsService
  ) {}

  async initVaults(chainId: number) {
    try {
      this._init.next(true);
      const chainVaults = VAULTS[chainId];
      if (!chainVaults) {
        this._error.next(new Error(`Unsupported chainId: ${chainId}`));
        this._vaults.next([]);
        this._init.next(false);
        return;
      }

      if (!chainVaults.length) {
        this._vaults.next([]);
        this._init.next(false);
        return;
      }

      const vaults = [];
      for (const vault of chainVaults) {
        const vaultRef: IVault = {
          ...vault,
        };

        await this._initVaultFields(vaultRef);

        const {
          walletBalanceBN,
          pricePerShare,
          userLpDepositBalanceFull,
          userLpDepositBalanceUI,
          userLpWalletBalance,
          userLpDepositBalanceBN,
        } = await this.statService.getVaultUserStats(
          vaultRef,
          this.web3.web3Info.userAddress
        );
        vaultRef.walletBalanceBN = walletBalanceBN;
        vaultRef.userLpWalletBalance = userLpWalletBalance;
        vaultRef.pricePerShare = pricePerShare;
        vaultRef.userLpDepositBalanceFull = userLpDepositBalanceFull;
        vaultRef.userLpDepositBalanceUI = userLpDepositBalanceUI;
        vaultRef.userLpDepositBalanceBN = userLpDepositBalanceBN;

        await this._setVaultAllowance(vaultRef);
        vaults.push(vaultRef);
      }

      this._vaults.next(vaults);
      this._init.next(false);
    } catch (error) {
      console.error(error);
      this._init.next(false);
      this._vaults.next([]);
      this._error.next(new Error(`Error initializing vaults`));
    }
  }

  private async _setVaultAllowance(vault: IVault) {
    try {
      // Will handle single stake and pairs just the same
      const tokenContract = new Pair(
        vault.lpAddress,
        this.web3.web3Info.signer
      );
      // Check/set allowance for vault pair
      const allowance = await tokenContract.allowance(
        this.web3.web3Info.userAddress,
        vault.vaultAddress
      );

      if (allowance.value.gt(ethers.constants.Zero)) {
        vault.contractApproved = true;
      }
    } catch (error) {
      throw error;
    }
  }

  private async _initVaultFields(vault: IVault) {
    try {
      vault.contract = this.getVaultInstance(vault.vaultAddress);
      vault.stratRef = new Strategy(
        vault.strategy.address,
        this.web3.web3Info.provider
      );

      if (vault.isProtocolVersion) {
        const protocolWithdrawalFee =
          await vault.stratRef.protocolWithdrawalFee();
        vault.strategy.protocolWithdrawFee = protocolWithdrawalFee / 10;
      }

      // Get/set basic vault token info
      const [name, symbol, paused, withdrawalFee] = await Promise.all([
        vault.contract.name(),
        vault.contract.symbol(),
        vault.stratRef.paused(),
        vault.stratRef.withdrawalFee(),
      ]);

      vault.tokenName = name;
      vault.symbol = symbol;
      vault.strategy.paused = paused;
      vault.strategy.withdrawlFee = withdrawalFee;
    } catch (error) {
      console.error(error);
      this._error.next(new Error(`Error initializing vault: ${vault.name}`));
    }
  }

  getVault(address: string) {
    return this._vaults.value.find((v) => v.vaultAddress == address);
  }

  async deposit(vault: IVault, amount: ethers.BigNumber, initVaults = true) {
    try {
      return await this._deposit(vault, amount, initVaults);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Vault deposit Error'));
    }
  }

  async depositAll(vault: IVault, initVaults = true) {
    try {
      return await this._deposit(vault, vault.walletBalanceBN, initVaults);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Vault deposit Error'));
    }
  }

  private async _deposit(
    vault: IVault,
    amountIn: ethers.BigNumber,
    initVaults: boolean
  ) {
    try {
      await this.approveVaultIfNeeded(vault, amountIn, vault.lpAddress);
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const depositTx = await vaultContract.deposit(amountIn);
      const txReceipt = await awaitTransactionComplete(depositTx);
      this._operationActive.next('Vault deposit complete');
      if (initVaults) {
        await this.initVaults(this.web3.web3Info.chainId);
      }

      return txReceipt;
    } catch (error) {
      throw error;
    }
  }

  async withdraw(vault: IVault, amount: ethers.BigNumber) {
    try {
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const tx = await vaultContract.withdraw(amount);
      await awaitTransactionComplete(tx);
      await this.initVaults(this.web3.web3Info.chainId);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Withdraw Error'));
    }
  }

  async withdrawAll(vault: IVault) {
    try {
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const tx = await vaultContract.withdrawAll();
      await awaitTransactionComplete(tx);
      await this.initVaults(this.web3.web3Info.chainId);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Withdraw Error'));
    }
  }

  private async approveVaultIfNeeded(
    vault: IVault,
    amount: ethers.BigNumber,
    erc20Address: string
  ) {
    try {
      this._operationActive.next('Checking allowances..');
      const token = new ERC20(erc20Address, this.web3.web3Info.signer);
      let allowance = await token.allowance(
        this.web3.web3Info.userAddress,
        vault.vaultAddress
      );
      if (allowance.value.lt(amount)) {
        await this.approveVault(vault);
        vault.contractApproved = true;
      }
      this._operationActive.next(null);
    } catch (error) {
      throw error;
    }
  }

  async approveVault(
    vault: IVault,
    amount: ethers.BigNumber = ethers.constants.MaxUint256
  ) {
    try {
      this._operationActive.next('Approving contract...');
      // Will handle single stake and pairs just the same
      const tokenContract = new ERC20(
        vault.lpAddress,
        this.web3.web3Info.signer
      );
      await tokenContract.approve(vault.vaultAddress, amount);
      vault.contractApproved = true;

      this._operationActive.next('Approvals complete.');
    } catch (error) {
      console.error(error);
    }
  }

  private getVaultInstance(address: string) {
    return new ethers.Contract(address, VAULT_ABI, this.web3.web3Info.signer);
  }
}
