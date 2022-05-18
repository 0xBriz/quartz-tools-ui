import { ChainZapData } from '../types/zap.types';
import { ZAPS_BSC } from './bsc/zaps';
import { BINANCE_SMART_CHAIN, HARDHAT_CHAIN } from './chains';

export const ZAPS: ChainZapData = {
  [BINANCE_SMART_CHAIN.chainId]: ZAPS_BSC,
  [HARDHAT_CHAIN.chainId]: ZAPS_BSC,
};
