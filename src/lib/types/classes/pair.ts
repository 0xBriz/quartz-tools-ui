import { ethers } from 'ethers';
import { UNIV2_PAIR_ABI } from 'src/lib/abis/UniV2Pair';
import { IPair } from '../token.types';
import { ERC20 } from './erc20';
import { ERC20TokenBase } from './erc20-token-base';

export class Pair extends ERC20TokenBase implements IPair {
  private _addressToken0: string;
  private _addressToken1: string;
  private _erc20Token0: ERC20;
  private _erc20Token1: ERC20;

  constructor(address: string, signer: ethers.Signer) {
    super(address, UNIV2_PAIR_ABI, signer);
  }

  async token0() {
    if (!this._addressToken0) {
      this._addressToken0 = await this.contract.token0();
    }

    return this._addressToken0;
  }

  async token1() {
    if (!this._addressToken1) {
      this._addressToken1 = await this.contract.token1();
    }

    return this._addressToken1;
  }

  async erc20Token0() {
    if (!this._erc20Token0) {
      this._erc20Token0 = new ERC20(await this.token0(), this.contract.signer);
    }

    return this._erc20Token0;
  }

  async erc20Token1() {
    if (!this._erc20Token1) {
      this._erc20Token1 = new ERC20(await this.token1(), this.contract.signer);
    }

    return this._erc20Token1;
  }
}
