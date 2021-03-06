import { ethers } from 'ethers';
import { IVault } from '../../types/vault.types';
import {
  V2_STRAT_ASHARE_UST_ADDRESS_BSC,
  V2_VAULT_ASHARE_UST_ADDRESS_BSC,
  V2_STRAT_SINGLE_STAKE_AMETHYST_ADDRESS_BSC,
  V2_VAULT_SINGLE_STAKE_AMETHYST_ADDRESS_BSC,
  STRAT_AMETHYST_BUSD_ADDRESS_BSC,
  STRAT_ASHARE_BUSD_ADDRESS_BSC,
  VAULT_AMETHYST_BUSD_ADDRESS_BSC,
  VAULT_ASHARE_BUSD_ADDRESS_BSC,
  VAULT_AMETHYST_SINGLE_ADDRESS_BSC,
  STRAT_AMETHYST_SINGLE_ADDRESS_BSC,
} from './bsc-addresses';
import {
  PAIR_ASHARE_UST_BSC,
  PAIR_AMETHYST_BUSD_BSC,
  PAIR_ASHARE_BUSD_BSC,
} from './pairs';
import { BINANCE_SMART_CHAIN } from '../chains';
import { TOKENS } from '../tokens';
import { getAmethystPrice, getAsharePrice } from './pricing';
import { ZAP_AMES_BUSD_BSC, ZAP_ASHARE_BUSD_BSC } from './zaps';

export const V2_VAULT_ASHARE_UST_BSC: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'X-ASHARE-UST',
  poolId: 1,
  vaultAddress: V2_VAULT_ASHARE_UST_ADDRESS_BSC,
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
    address: V2_STRAT_ASHARE_UST_ADDRESS_BSC,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: getAsharePrice,
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: false,
  isProtocolVersion: true,
};

export const VAULT_AMETHYST_BUSD_BSC: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'AMES-BUSD',
  poolId: 9,
  vaultAddress: VAULT_AMETHYST_BUSD_ADDRESS_BSC,
  lpAddress: PAIR_AMETHYST_BUSD_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalanceUI: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/ames-busd.png',
  contractApproved: false,
  strategy: {
    address: STRAT_AMETHYST_BUSD_ADDRESS_BSC,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: getAmethystPrice,
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: false,
  isProtocolVersion: true,
  zap: ZAP_AMES_BUSD_BSC,
};

export const VAULT_ASHARE_BUSD_BSC: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'ASHARE-BUSD',
  poolId: 8,
  vaultAddress: VAULT_ASHARE_BUSD_ADDRESS_BSC,
  lpAddress: PAIR_ASHARE_BUSD_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalanceUI: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/ashare-busd.png',
  contractApproved: false,
  strategy: {
    address: STRAT_ASHARE_BUSD_ADDRESS_BSC,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: getAsharePrice,
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: false,
  isProtocolVersion: true,
  zap: ZAP_ASHARE_BUSD_BSC,
};

const VAULT_SINGLE_STAKE_AMETHYST: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'AMES',
  poolId: 6,
  vaultAddress: VAULT_AMETHYST_SINGLE_ADDRESS_BSC,
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
    address: STRAT_AMETHYST_SINGLE_ADDRESS_BSC,
  },
  fetchPriceToken0: getAmethystPrice,
  fetchPriceToken1: async () => {
    return null;
  },
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: true,
  isProtocolVersion: true,
};

const V2_VAULT_SINGLE_STAKE_AMETHYST: IVault = {
  active: true,
  chainId: BINANCE_SMART_CHAIN.chainId,
  name: 'AMES',
  poolId: 6,
  vaultAddress: V2_VAULT_SINGLE_STAKE_AMETHYST_ADDRESS_BSC,
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
    address: V2_STRAT_SINGLE_STAKE_AMETHYST_ADDRESS_BSC,
  },
  fetchPriceToken0: getAmethystPrice,
  fetchPriceToken1: async () => {
    return null;
  },
  fetchRewardTokenPrice: getAsharePrice,
  compoundsDaily: BINANCE_SMART_CHAIN.compoundsGuessimate,
  isSingleStake: true,
  isProtocolVersion: true,
};

export const VAULTS_BSC = [
  VAULT_AMETHYST_BUSD_BSC,
  VAULT_ASHARE_BUSD_BSC,
  VAULT_SINGLE_STAKE_AMETHYST,
  V2_VAULT_SINGLE_STAKE_AMETHYST,
  V2_VAULT_ASHARE_UST_BSC,
];
