import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { ethers } from 'ethers';
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

  constructor(
    public readonly vaultService: VaultService,
    private readonly vaultStats: StatsService,
    private readonly webService: Web3Service
  ) {
    const sub = this.webService.error.subscribe(
      (err) => (this.vault.loading = false)
    );
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
    this.vault.loading = true;
    console.log(this.depositInput.value);
    await this.vaultService.deposit(
      this.vault,
      ethers.utils.parseUnits(this.depositInput.value)
    );
    this.resetInputs();
    this.vault.loading = false;
  }

  async setVaultDepositAll() {
    this.vault.loading = true;
    await this.vaultService.depositAll(this.vault);
    this.resetInputs();
    this.vault.loading = false;
  }

  async setVaultWithdraw() {
    this.vault.loading = true;
    await this.vaultService.withdraw(
      this.vault,
      ethers.utils.parseUnits(this.withdrawInput.value)
    );
    this.vault.loading = false;
    this.resetInputs();
  }

  async setVaultWithdrawAll() {
    this.vault.loading = true;
    await this.vaultService.withdrawAll(this.vault);
    this.vault.loading = false;
    this.resetInputs();
  }

  async setApproval() {
    this.vault.loading = true;
    await this.vaultService.approveVault(this.vault);
    this.vault.loading = false;
  }

  onDepositSliderInputChange(value: number) {
    if (value === 0) {
      this.depositInput.value = '0';
      return;
    }

    if (value === 100) {
      this.depositInput.value = String(this.vault.userLpWalletBalance);
      return;
    }

    this.depositInput.value = String(
      this.vault.userLpWalletBalance * (value / 100)
    );
  }

  onWithdrawSliderInputChange(value: number) {
    if (value === 0) {
      this.withdrawInput.value = '0';
      return;
    }

    if (value === 100) {
      this.withdrawInput.value = String(this.vault.userLpDepositBalance);
      return;
    }

    this.withdrawInput.value = String(
      this.vault.userLpDepositBalance * (value / 100)
    );
  }
}
