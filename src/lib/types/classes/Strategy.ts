import { BigNumber, ethers } from 'ethers';
import { STRATEGY_ABI } from 'src/lib/abis/strategy-abi';

export class Strategy {
  public readonly contract: ethers.Contract;

  constructor(address: string, provider: ethers.providers.JsonRpcProvider) {
    this.contract = new ethers.Contract(address, STRATEGY_ABI, provider);
  }

  async paused(): Promise<boolean> {
    return await this.contract.paused();
  }

  async withdrawalFee() {
    const fee: BigNumber = await this.contract.withdrawalFee();
    return fee.toNumber() / 1000;
  }

  async protocolWithdrawalFee() {
    return await this.contract.protocolWithdrawalFee();
  }
}
