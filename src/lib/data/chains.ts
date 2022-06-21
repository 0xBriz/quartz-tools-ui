import { ChainBaseConfig } from '../types/chain.types';
import { SECONDS_IN_YEAR } from '../utils/time-constants';

export const HARMONY_CHAIN: ChainBaseConfig = {
  name: 'Harmony',
  nativeToken: { coinGeckoId: 'harmony' },
  chainId: 1666600000,
  blockTimeSeconds: 2,
  blocksPerYear: SECONDS_IN_YEAR / 2,
  compoundsGuessimate: 4 * 24, //  Hard coded until API is set up
};

export const BINANCE_SMART_CHAIN: ChainBaseConfig = {
  name: 'BSC',
  nativeToken: { coinGeckoId: 'binancecoin' },
  chainId: 56,
  blockTimeSeconds: 3,
  blocksPerYear: SECONDS_IN_YEAR / 3,
  compoundsGuessimate: 1, //  Hard coded until API is set up
};

export const HARDHAT_CHAIN: ChainBaseConfig = {
  name: 'Hardhat',
  nativeToken: { coinGeckoId: 'binancecoin' },
  chainId: 31337,
  blockTimeSeconds: 3,
  blocksPerYear: SECONDS_IN_YEAR / 3,
  compoundsGuessimate: 2, //  Hard coded until API is set up
};

export const CHAIN_ID_MAP = {
  [HARMONY_CHAIN.chainId]: {
    ...HARMONY_CHAIN,
  },
  [BINANCE_SMART_CHAIN.chainId]: {
    ...BINANCE_SMART_CHAIN,
  },
  [HARDHAT_CHAIN.chainId]: {
    ...BINANCE_SMART_CHAIN,
  },
};

export const CURRENT_CHAINS: ChainBaseConfig[] = [
  BINANCE_SMART_CHAIN,
  HARMONY_CHAIN,
  HARDHAT_CHAIN,
  // {
  //   name: 'Polygon',
  //   nativeToken: { coinGeckoId: 'matic-network' },
  // },
  // {
  //   name: 'Avalanche',
  //   nativeToken: { coinGeckoId: 'avalanche-2' },
  //   chainId: 43114,
  // },
  // {
  //   name: 'Fantom',
  //   nativeToken: { coinGeckoId: 'fantom' },
  //   chainId: 250,
  // },
  // {
  //   name: 'Near',
  //   nativeToken: { coinGeckoId: 'near' },
  // },
  // {
  //   name: 'Aurora',
  //   nativeToken: { coinGeckoId: 'aurora-near' },
  // },
];
