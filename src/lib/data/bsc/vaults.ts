import { ethers } from 'ethers';
import { IVault } from '../../types/vault.types';
import { getSingleTokenPrice } from '../../utils/http-utils';
import {
  STRAT_1QSHARE_UST_ADDRESS_BSC,
  STRAT_AMETHYST_UST_ADDRESS_BSC,
  STRAT_ASHARE_UST_ADDRESS_BSC,
  VAULT_1QSHARE_UST_ADDRESS_BSC,
  VAULT_AMETHYST_UST_ADDRESS_BSC,
  VAULT_ASHARE_UST_ADDRESS_BSC,
} from './bsc-addresses';
import {
  PAIR_AMETHYST_UST_BSC,
  PAIR_ASHARE_UST_BSC,
  PAIR_1QSHARE_UST_BSC,
} from './pairs';
import { BINANCE_SMART_CHAIN } from '../chains';
import { VAULTS_HARMONY } from '../harmony/harmony-vaults';

export const VAULT_AMETHYST_UST_BSC: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'AMES-UST',
  poolId: 0,
  vaultAddress: VAULT_AMETHYST_UST_ADDRESS_BSC,
  lpAddress: PAIR_AMETHYST_UST_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/ames-ust-lp-logo.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_AMETHYST_UST_ADDRESS_BSC,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: async () => {
    return (await getSingleTokenPrice('amethyst')).usd;
  },
  fetchRewardTokenPrice: async () => {
    return (await getSingleTokenPrice('quartz-defi-ashare')).usd;
  },
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
};

export const VAULT_ASHARE_UST_BSC: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'ASHARE-UST',
  poolId: 1,
  vaultAddress: VAULT_ASHARE_UST_ADDRESS_BSC,
  lpAddress: PAIR_ASHARE_UST_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/ashare-ust-lp-logo.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_ASHARE_UST_ADDRESS_BSC,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: async () => {
    return (await getSingleTokenPrice('quartz-defi-ashare')).usd;
  },
  fetchRewardTokenPrice: async () => {
    return (await getSingleTokenPrice('quartz-defi-ashare')).usd;
  },
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
};

// export const VAULT_1QSHARE_UST_BSC: IVault = {
//   active: false,
//   chainId: BINANCE_SMART_CHAIN.chainId,
//   name: '1QSHARE-UST',
//   poolId: 2,
//   vaultAddress: VAULT_1QSHARE_UST_ADDRESS_BSC,
//   lpAddress: PAIR_1QSHARE_UST_BSC,
//   userLpWalletBalance: 0,
//   walletBalanceBN: ethers.constants.Zero,
//   userLpDepositBalance: 0,
//   userLpDepositBalanceBN: ethers.constants.Zero,
//   APY: 0,
//   dailyAPR: 0.0,
//   totalValueLocked: 0,
//   tvlChecked: false,
//   loading: false,
//   logoURI: 'assets/1share-ust-lp-logo.svg',
//   contractApproved: false,
//   strategy: {
//     address: STRAT_1QSHARE_UST_ADDRESS_BSC,
//   },
//   fetchPriceToken0: async () => 1,
//   fetchPriceToken1: async () => {
//     // TODO: need to setup fetching AMM pricing for non gecko tokens
//     return 25;
//   },
//   fetchRewardTokenPrice: async () => {
//     return (await getSingleTokenPrice('quartz-defi-ashare')).usd;
//   },
//   compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
// };

export const VAULTS_BSC = [
  VAULT_AMETHYST_UST_BSC,
  VAULT_ASHARE_UST_BSC,
  // VAULT_1QSHARE_UST_BSC,
];

export const ALL_VAULTS = {
  [56]: VAULTS_BSC,
  [1666600000]: VAULTS_HARMONY,
};