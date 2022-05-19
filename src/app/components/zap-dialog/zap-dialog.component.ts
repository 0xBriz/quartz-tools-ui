import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Web3Service } from 'src/lib/services/web3.service';
import { ZapService } from 'src/lib/services/zaps/zap.service';
import { IZapPool, IZapResult } from 'src/lib/types/zap.types';
import { ZapInComponent } from '../zap-in/zap-in.component';

@Component({
  selector: 'quartz-zap-dialog',
  templateUrl: './zap-dialog.component.html',
  styleUrls: ['./zap-dialog.component.scss'],
})
export class ZapDialogComponent implements AfterViewInit {
  @ViewChild(ZapInComponent, {
    static: true,
  })
  zapper: ZapInComponent;

  transactionCount = 2;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { zapper: IZapPool },
    private dialogRef: MatDialogRef<ZapDialogComponent>,
    private web3: Web3Service,
    private zapService: ZapService
  ) {}

  async ngOnInit() {
    const [vaultAllowance] = await Promise.all([
      this.data.zapper.pair.allowance(
        this.web3.web3Info.userAddress,
        this.data.zapper.vaultAddress
      ),
    ]);

    if (vaultAllowance.value.eq(0)) {
      this.transactionCount++;
    }
  }

  ngAfterViewInit() {
    this.zapper.dialogMode = true;
  }

  handleZapResult(result: IZapResult) {
    this.dialogRef.close(result);
  }
}
