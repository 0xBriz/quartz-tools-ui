import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { Subscription } from 'rxjs';
import { StatsService } from 'src/lib/services/stats/stats.service';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { Web3Service } from 'src/lib/services/web3.service';
import { IVault } from 'src/lib/types/vault.types';

@Component({
  selector: 'quartz-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
})
export class VaultComponent implements OnInit, OnDestroy {
  fadeIn: any;
  @Input() vault: IVault;
  @ViewChild('depositInput', {
    read: MatInput,
    static: true,
  })
  depositInput: MatInput;
  @ViewChild('withdrawInput', {
    read: MatInput,
    static: true,
  })
  withdrawInput: MatInput;

  private _subs = new Subscription();

  private _depositAmountMachine: ethers.BigNumber = ethers.constants.Zero;
  private _withdrawAmountMachine: ethers.BigNumber = ethers.constants.Zero;

  constructor(
    public readonly vaultService: VaultService,
    private readonly vaultStats: StatsService,
    private readonly webService: Web3Service
  ) {
    const sub = this.webService.error.subscribe((err) => {
      this.vault.loading = false;
      this.resetInputs();
    });
    this._subs.add(sub);
  }

  async ngOnInit() {
    this.resetInputs();
    const { vaultTVL, APR, dailyAPR, APY } = await this.vaultStats.getVaultTVL(
      this.vault
    );
    this.vault.totalValueLocked = vaultTVL;
    this.vault.APR = APR;
    this.vault.dailyAPR = dailyAPR;
    this.vault.APY = APY;
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  private resetInputs() {
    this.depositInput.value = '0';
    this.withdrawInput.value = '0';
  }

  async setVaultDeposit() {
    if (this._depositAmountMachine.gt(ethers.constants.Zero)) {
      this.vault.loading = true;
      console.log(this.vault.walletBalanceBN.toString());
      console.log(this._depositAmountMachine.toString());
      console.log(ethers.utils.formatEther(this.vault.walletBalanceBN));
      console.log(ethers.utils.formatEther(this._depositAmountMachine));

      await this.vaultService.deposit(this.vault, this._depositAmountMachine);
      this.resetInputs();
      this.vault.loading = false;
    }
  }

  async setVaultDepositAll() {
    this.vault.loading = true;
    await this.vaultService.depositAll(this.vault);
    this.resetInputs();
    this.vault.loading = false;
  }

  async setVaultWithdraw() {
    if (this._withdrawAmountMachine.gt(ethers.constants.Zero)) {
      this.vault.loading = true;
      await this.vaultService.withdraw(this.vault, this._withdrawAmountMachine);
      this.vault.loading = false;
      this.resetInputs();
    }
  }

  async setVaultWithdrawAll() {
    this.vault.loading = true;
    await this.vaultService.withdrawAll(this.vault);
    this.vault.loading = false;
    this.resetInputs();
  }

  onDepositSliderInputChange(value: number) {
      if (value === 0) {
      this._depositAmountMachine = ethers.constants.Zero;
      this.depositInput.value = '0';
      return;
    }

    if (value === 100) {
      this._depositAmountMachine = this.vault.walletBalanceBN;
      this.depositInput.value = String(this.vault.userLpWalletBalance);
      return;
    }

    const percentage = this.vault.walletBalanceBN.mul(value).div(100);
    this.depositInput.value = formatEther(percentage);
    this._depositAmountMachine = percentage;
  }

  onWithdrawSliderInputChange(value: number) {
        if (value === 0) {
      this._withdrawAmountMachine = ethers.constants.Zero;
      this.withdrawInput.value = '0';
      return;
    }

    if (value === 100) {
      this._withdrawAmountMachine = this.vault.userLpDepositBalanceBN;
      this.withdrawInput.value = String(this.vault.userLpDepositBalanceUI);
      return;
    }

    const percentage = this.vault.userLpDepositBalanceBN.mul(value).div(100);
    this.withdrawInput.value = formatEther(percentage);
    this._withdrawAmountMachine = percentage;
  }

  async setApproval() {
    this.vault.loading = true;
    await this.vaultService.approveVault(this.vault);
    this.vault.loading = false;
    this.vault.contractApproved = true;
  }
}
