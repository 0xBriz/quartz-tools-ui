import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChainBaseConfig } from 'src/lib/types/chain.types';
import { getCoinGeckoData } from 'src/lib/utils/http-utils';
import {
  BINANCE_SMART_CHAIN,
  CURRENT_CHAINS,
  HARDHAT_CHAIN,
  HARMONY_CHAIN,
} from '../../data/chains';

@Injectable({ providedIn: 'root' })
export class ChainService {
  private _chains = new BehaviorSubject<ChainBaseConfig[]>(CURRENT_CHAINS);
  get chains() {
    return this._chains.asObservable();
  }

  private readonly currentSupportedChains = [
    HARMONY_CHAIN,
    BINANCE_SMART_CHAIN,
    HARDHAT_CHAIN,
  ];

  constructor() {}

  isChainSupported(chainId) {
    return this.currentSupportedChains.find((c) => c.chainId == chainId);
  }

  async getChain(name: string): Promise<ChainBaseConfig> {
    const chain = this._chains.value.find((c) => c.name === name);
    chain.nativeToken = await getCoinGeckoData(chain.nativeToken.coinGeckoId);
    return chain;
  }

  // EVM chains
  async getChainById(chainId: number): Promise<ChainBaseConfig> {
    const chain = this._chains.value.find((c) => c.chainId == chainId);
    if (!chain) {
      throw new Error(`Chain not found: ${chain}`);
    }
    chain.nativeToken = await getCoinGeckoData(chain.nativeToken.coinGeckoId);
    return chain;
  }
}
