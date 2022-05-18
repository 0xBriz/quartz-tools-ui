import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DataWatchService } from 'src/lib/services/data-watch.service';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { Web3Service } from 'src/lib/services/web3.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { IVault } from 'src/lib/types/vault.types';

@Component({
  selector: 'quartz-vault-container',
  templateUrl: './vault-container.component.html',
  styleUrls: ['./vault-container.component.scss'],
  animations: [trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))])],
})
export class VaultsContainerComponent implements OnDestroy {
  fadeIn: any;
  private _subs = new Subscription();
  private _dataWatchInterval = 1000 * 60 * 3;
  loadingVaults = true;
  vaults = [];

  constructor(
    private readonly web3: Web3Service,
    public readonly vaultService: VaultService,
    private readonly snackBar: MatSnackBar,
    private readonly watcher: DataWatchService
  ) {
    this.web3.web3.subscribe((web3Info) => {
      if (web3Info) {
        this.vaultService.initVaults(web3Info.chainId);
        this.watcher.watchVaults(
          this._dataWatchInterval,
          this.web3.web3Info.chainId
        );
      } else {
        this.watcher.stopWatchingVaults();
      }
    });

    const s1 = this.vaultService.error.subscribe((err) => {
      this.snackBar.dismiss();
      this.snackBar.open(err.message, '', {
        duration: 1000 * 5,
      });
    });

    const s2 = this.vaultService.operationActive.subscribe((msg) => {
      this.snackBar.dismiss();
      if (msg) {
        this.snackBar.open(msg, '', {
          duration: 1000 * 5,
        });
      }
    });

    const s3 = this.vaultService.init.subscribe((init) => {
      this.loadingVaults = init;
    });

    this._subs.add(s1);
    this._subs.add(s2);
    this._subs.add(s3);
  }

  async doZap(vault: IVault) {
    //
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
    this.watcher.stopWatchingVaults();
  }
}
