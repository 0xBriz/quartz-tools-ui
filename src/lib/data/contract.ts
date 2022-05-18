import { QuartzContract } from '../types/quartz-contract.types';
import {
  REWARD_POOL_ADDRESS_BSC,
  ZAPPER_ADDRESS_BSC,
  ZAPPER_ADDRESS_HARDHAT,
} from './bsc/bsc-addresses';
import { BINANCE_SMART_CHAIN, HARDHAT_CHAIN } from './chains';

export const AMES_CONTRACTS: {
  [chainId: number]: { [name in QuartzContract]: string };
} = {
  [BINANCE_SMART_CHAIN.chainId]: {
    Zapper: ZAPPER_ADDRESS_BSC,
    RewardPool: REWARD_POOL_ADDRESS_BSC,
  },
  [HARDHAT_CHAIN.chainId]: {
    Zapper: ZAPPER_ADDRESS_HARDHAT,
    RewardPool: REWARD_POOL_ADDRESS_BSC,
  },
};
