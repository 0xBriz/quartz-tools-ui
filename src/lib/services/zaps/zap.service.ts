import { Injectable } from '@angular/core';
import { ContractReceipt, ethers } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import { AMES_CONTRACTS } from 'src/lib/data/contract';
import { ZAPS } from 'src/lib/data/zaps';
import { ERC20 } from 'src/lib/types/classes/erc20';
import { Pair } from 'src/lib/types/classes/pair';
import { IVault } from 'src/lib/types/vault.types';
import {
  ChainZapInfo,
  IZapPool,
  IZapResult,
  ZapDestination,
  ZapInput,
} from 'src/lib/types/zap.types';
import { roundDecimals } from 'src/lib/utils/formatting';
import { awaitTransactionComplete } from 'src/lib/utils/web3-utils';
import { RewardPool } from '../reward-pool/reward-pool';
import { CommonServiceEvents } from '../service-events-common';
import { VaultService } from '../vaults/vault.service';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class ZapService extends CommonServiceEvents {
  private _contract: ethers.Contract;

  private _zaps = new BehaviorSubject<IZapPool[]>([]);
  get zaps() {
    return this._zaps.asObservable();
  }

  private _approved = new Subject<boolean>();
  get approved() {
    return this._approved.asObservable();
  }

  private _chainZapData: ChainZapInfo;

  constructor(
    private readonly web3: Web3Service,
    private readonly rewardPool: RewardPool,
    private readonly vaultService: VaultService
  ) {
    super();

    this.web3.web3.subscribe((info) => {
      if (info) {
        this.setContract(info.chainId);
      }
    });

    this.web3.chain.subscribe((chain) => {
      if (chain) {
        this.setContract(chain.chainId);
      }
    });
  }

  async setZapData(chainId: number) {
    this.setContract(chainId);

    const chainZaps = ZAPS[chainId];
    if (!chainZaps) {
      throw new Error('setZaps: Dafuq?');
    }

    this._chainZapData = chainZaps;
    const zappers: IZapPool[] = await this._setupZaps();
    this._zaps.next(zappers);
  }

  private setContract(chainId: number) {
    try {
      const address = AMES_CONTRACTS[chainId].Zapper;
      if (!address) {
        throw new Error('setContract: Dafuq?');
      }

      this._contract = new ethers.Contract(
        address,
        [
          `function zapInWithPath(address, address, uint256, address, address[], address[]) public`,
        ],
        this.web3.web3Info.signer
      );
    } catch (error) {
      this._error.next('Error getting zaps contract');
    }
  }

  async zapInWithPath(zapInput: ZapInput) {
    try {
      if (!this._zaps.value.length) {
        await this.setZapData(this.web3.web3Info.chainId);
      }

      const zapInfo = this._zaps.value.find(
        (z) => z.pairAddress === zapInput.pairAddress
      );

      // Read routing path mapping for selected input token
      const tokenOptions = zapInfo.tokenInputOptions.find(
        (opt) => opt.address == zapInput.tokenInAddress
      );

      if (
        !tokenOptions.pathTokenInToLp0.length ||
        !tokenOptions.pathTokenInToLp1.length
      ) {
        throw new Error('dafuq?');
      }

      await this.approveZapperIfNeeded(
        zapInput.tokenInAddress,
        zapInput.tokenInAmountBN
      );

      const tx = await this._contract.zapInWithPath(
        zapInput.tokenInAddress,
        zapInput.pairAddress,
        zapInput.tokenInAmountBN,
        zapInfo.routerAddress,
        tokenOptions.pathTokenInToLp0,
        tokenOptions.pathTokenInToLp1
      );

      await awaitTransactionComplete(tx);

      // Return the amount of LP tokens for convenience
      return this.getZapResult(zapInfo.pairAddress);
    } catch (error) {
      console.error(error);
      this._error.next('Error zapping in');
    }
  }

  async depositZapResult(
    zap: IZapPool,
    zapResult: IZapResult,
    destination: ZapDestination
  ): Promise<ContractReceipt> {
    try {
      let tx;

      if (destination === 'Farm') {
        const chefAllowance = await zap.pair.allowance(
          this.web3.web3Info.userAddress,
          this.rewardPool.contract.address
        );

        if (chefAllowance.value.lt(zapResult.lpTokensBN)) {
          await zap.pair.approve(
            this.rewardPool.contract.address,
            ethers.constants.MaxUint256
          );
        }
        tx = await this.rewardPool.deposit(zap.poolId, zapResult.lpTokensBN);
      }

      if (destination === 'Vault') {
        const vaultAllowance = await zap.pair.allowance(
          this.web3.web3Info.userAddress,
          zap.vaultAddress
        );

        if (vaultAllowance.value.lt(zapResult.lpTokensBN)) {
          await zap.pair.approve(zap.vaultAddress, ethers.constants.MaxUint256);
        }

        tx = await this.vaultService.deposit(
          this.vaultService.getVault(zap.vaultAddress),
          zapResult.lpTokensBN,
          false
        );
      }

      return tx;
    } catch (error) {
      console.error(error);
      this._error.next('Error depositing zap result');
    }
  }

  async getZapResult(pairAddress: string): Promise<IZapResult> {
    const pair = new ERC20(pairAddress, this.web3.web3Info.signer);
    const lpTokens = await pair.balanceOf(this.web3.web3Info.userAddress);

    if (lpTokens.value.isZero()) {
      return null;
    }

    return {
      lpTokensUI: roundDecimals(lpTokens.toNumber(), 8),
      lpTokensBN: lpTokens.value,
    };
  }

  async zapInVault(vault: IVault) {
    try {
      // const input: ZapInput = {
      //   tokenInAddress: tokenIn.address,
      //   pairAddress: this.zap.pairAddress,
      //   tokenInAmount,
      //   tokenInAmountBN,
      // };
      const zap = await this.initZap(vault.zap);
    } catch (error) {
      this._error.next('Error approving contract');
    }
  }

  async approveZapperIfNeeded(
    tokenInAddress: string,
    amountIn: ethers.BigNumber
  ) {
    try {
      const tokenIn = new ERC20(tokenInAddress, this.web3.web3Info.signer);
      const allowance = await tokenIn.allowance(
        this.web3.web3Info.userAddress,
        this._contract.address
      );

      if (allowance.value.lt(amountIn)) {
        await tokenIn.approve(
          this._contract.address,
          ethers.constants.MaxUint256
        );
      }
    } catch (error) {
      this._error.next('Error approving contract');
    }
  }

  /**
   * Initialze zap contract info for easier UI component work.
   * Call after setting value for `_chainZapData`
   * @param zapInfo
   */
  private async _setupZaps() {
    try {
      const zappers: IZapPool[] = [];
      for (const zap of this._chainZapData.ZAPS) {
        zappers.push(await this.initZap(zap));
      }

      return zappers;
    } catch (error) {
      throw error;
    }
  }

  async initZap(zap: IZapPool) {
    const zapIn: IZapPool = {
      ...zap,
    };
    if (!zapIn.pair) {
      zapIn.pair = new Pair(zapIn.pairAddress, this.web3.web3Info.signer);
    }

    if (!zapIn.token0 || !zapIn.token1) {
      zapIn.token0 = new ERC20(
        await zapIn.pair.token0(),
        this.web3.web3Info.signer
      );
      zapIn.token0 = new ERC20(
        await zapIn.pair.token1(),
        this.web3.web3Info.signer
      );
    }

    zapIn.tokenInputOptions = zap.tokenInputOptions;

    return zapIn;
  }
}
