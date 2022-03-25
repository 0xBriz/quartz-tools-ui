import { ethers } from 'ethers';
import { IVault } from '../../types/vault.types';
import {
  STRAT_AMETHYST_ASHARE_ADDRESS_BSC,
  STRAT_AMETHYST_UST_ADDRESS_BSC,
  STRAT_ASHARE_UST_ADDRESS_BSC,
  STRAT_SINGLE_STAKE_AMETHYST_ADDRESS_BSC,
  V2_STRAT_AMETHYST_UST_ADDRESS_BSC,
  V2_VAULT_AMETHYST_UST_ADDRESS_BSC,
  VAULT_AMETHYST_ASHARE_ADDRESS_BSC,
  VAULT_AMETHYST_UST_ADDRESS_BSC,
  VAULT_ASHARE_UST_ADDRESS_BSC,
  VAULT_SINGLE_STAKE_AMETHYST_ADDRESS_BSC,
} from './bsc-addresses';
import {
  PAIR_UST_AMETHYST_BSC,
  PAIR_ASHARE_UST_BSC,
  PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
} from './pairs';
import { BINANCE_SMART_CHAIN } from '../chains';
import { TOKENS } from '../tokens';
import { getAmethystPrice, getAsharePrice } from './pricing';

export const VAULT_AMETHYST_UST_BSC: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'AMES-UST',
  poolId: 0,
  vaultAddress: VAULT_AMETHYST_UST_ADDRESS_BSC,
  lpAddress: PAIR_UST_AMETHYST_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalanceUI: 0,
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
  fetchPriceToken1: getAmethystPrice,
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: false,
};

export const V2_VAULT_AMETHYST_UST_BSC: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'X-AMES-UST',
  poolId: 0,
  vaultAddress: V2_VAULT_AMETHYST_UST_ADDRESS_BSC,
  lpAddress: PAIR_UST_AMETHYST_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalanceUI: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/ames-ust-lp-logo.svg',
  contractApproved: false,
  strategy: {
    address: V2_STRAT_AMETHYST_UST_ADDRESS_BSC,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: getAmethystPrice,
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: false,
  protocolVersion: true,
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
  userLpDepositBalanceUI: 0,
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
  fetchPriceToken1: getAsharePrice,
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: false,
  isV2: true,
};

export const VAULT_AMETHYST_ASHARE_BSC: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'AMES-ASHARE',
  poolId: 5,
  vaultAddress: VAULT_AMETHYST_ASHARE_ADDRESS_BSC,
  lpAddress: PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalanceUI: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/ames-ashare-lp-logo.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_AMETHYST_ASHARE_ADDRESS_BSC,
  },
  fetchPriceToken0: getAmethystPrice,
  fetchPriceToken1: getAsharePrice,
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: false,
};

const VAULT_SINGLE_STAKE_AMETHYST: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'AMES',
  poolId: 6,
  vaultAddress: VAULT_SINGLE_STAKE_AMETHYST_ADDRESS_BSC,
  lpAddress: TOKENS.AMETHYST.BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalanceUI: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/ames-logo.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_SINGLE_STAKE_AMETHYST_ADDRESS_BSC,
  },
  fetchPriceToken0: getAmethystPrice,
  fetchPriceToken1: async () => {
    return null;
  },
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: true,
};

export const VAULTS_BSC = [
  V2_VAULT_AMETHYST_UST_BSC,
  VAULT_AMETHYST_ASHARE_BSC,
  VAULT_AMETHYST_UST_BSC,
  VAULT_SINGLE_STAKE_AMETHYST,
  VAULT_ASHARE_UST_BSC,
];
