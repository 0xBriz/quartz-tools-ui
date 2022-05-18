import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ethers } from 'ethers';
import { RewardPool } from 'src/lib/services/reward-pool/reward-pool';
import { TokenService } from 'src/lib/services/tokens/token.service';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { ZapService } from 'src/lib/services/zaps/zap.service';
import { IZapPool, TokenInputOption, ZapInput } from 'src/lib/types/zap.types';
import { ensureEtherFormat } from 'src/lib/utils/formatting';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { Web3Service } from 'src/lib/services/web3.service';

@Component({
  selector: 'quartz-zap-in',
  templateUrl: './zap-in.component.html',
  styleUrls: ['./zap-in.component.scss'],
  animations: [trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))])],
})
export class ZapInComponent implements OnInit {
  fadeIn: any;

  @Input() zap: IZapPool;
  zapGroup: FormGroup;

  private lastBalanceCheck = null;
  private balanceCheckLimit = 1000 * 30;

  currentSelectedToken: TokenInputOption = null;
  runningZap = false;

  zapResult: {
    lpTokensUI: number;
    lpTokensBN: ethers.BigNumber;
  };

  depositing = false;
  depositingTo = null;
  depositResult: {
    txHash?: string;
    explorerLink?: string;
  };

  constructor(
    private readonly tokenService: TokenService,
    public readonly zapService: ZapService,
    private readonly vaultService: VaultService,
    private readonly rewardPool: RewardPool,
    private readonly web3: Web3Service
  ) {}

  async ngOnInit() {
    this.zapGroup = new FormGroup({
      tokenIn: new FormControl(null, [Validators.required]),
      tokenInAmount: new FormControl(null, [Validators.required]),
    });

    // Show any current tokens available to deposit
    this.zapResult = await this.zapService.getZapResult(this.zap.pairAddress);
  }

  async runZapIn() {
    if (this.zapGroup.valid) {
      const tokenIn = this.zapGroup.get('tokenIn').value;
      const tokenInAmount = this.zapGroup.get('tokenInAmount').value;

      let tokenInAmountBN = ethers.utils.parseUnits(String(tokenInAmount), 18);
      tokenInAmountBN = ensureEtherFormat(tokenInAmountBN);

      const input: ZapInput = {
        tokenInAddress: tokenIn.address,
        pairAddress: this.zap.pairAddress,
        tokenInAmount,
        tokenInAmountBN,
      };

      this.runningZap = true;
      const zapResult = await this.zapService.zapInWithPath(input);
      this.runningZap = false;
      this.reset();
      this.zapResult = zapResult;
    }
  }

  setDepositMax() {
    if (this.currentSelectedToken?.userBalanceUI > 0) {
      this.zapGroup
        .get('tokenInAmount')
        .setValue(this.currentSelectedToken.userBalanceUI, {
          emitEvent: true,
        });
    }
  }

  async getInputTokenBalances() {
    // Limit balance queries in the event selects are being open and closed too frequently
    if (
      this.lastBalanceCheck &&
      Date.now() < this.lastBalanceCheck + this.balanceCheckLimit
    ) {
      return;
    }
    await this.tokenService.setUserTokenBalances(this.zap.tokenInputOptions);
    this.lastBalanceCheck = Date.now();
  }

  onSelectedChange(selectedTokenIn: TokenInputOption) {
    this.currentSelectedToken = selectedTokenIn;
  }

  async depositTo(depositingTo: 'Farm' | 'Vault') {
    try {
      if (this.zapResult?.lpTokensUI) {
        this.depositing = true;
        this.depositingTo = depositingTo;

        const tx = await this.zapService.depositZapResult(
          this.zap,
          this.zapResult,
          depositingTo
        );

        // // Allowances need to be checked
        // if (depositingTo === 'Farm') {
        //   tx = await this.doFarmDeposit();
        // }

        // if (depositingTo === 'Vault') {
        //   tx = await this.vaultService.deposit(
        //     this.vaultService.getVault(this.zap.vaultAddress),
        //     this.zapResult.lpTokensBN,
        //     false
        //   );
        // }

        if (tx) {
          this.depositResult = {};
          this.depositResult.txHash = tx.transactionHash;
          this.depositResult.explorerLink =
            'https://bscscan.com/tx/' + this.depositResult.txHash;
          this.depositing = false;
        }

        this.reset();
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async doFarmDeposit() {
    try {
      const chefAllowance = await this.zap.pair.allowance(
        this.web3.web3Info.userAddress,
        this.rewardPool.contract.address
      );

      if (chefAllowance.value.lt(this.zapResult.lpTokensBN)) {
        await this.zap.pair.approve(
          this.rewardPool.contract.address,
          ethers.constants.MaxUint256
        );
      }

      return this.rewardPool.deposit(
        this.zap.poolId,
        this.zapResult.lpTokensBN
      );
    } catch (error) {
      console.error(error);
    }
  }

  private reset() {
    this.zapGroup.reset();
    this.lastBalanceCheck = null;
    this.currentSelectedToken = null;
    this.zapResult = null;
  }
}
