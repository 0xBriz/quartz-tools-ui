import { BigNumber, Contract } from 'ethers';

export interface IVault {
  active: boolean;
  name: string;
  chainId: number;
  tokenName?: string;
  symbol?: string;
  poolId: number;
  vaultAddress: string;
  lpAddress: string;
  userLpWalletBalance: number;
  userWalletValueUSD?: number;
  walletBalanceBN: BigNumber;
  userLpDepositBalanceUI: number;
  userLpBaseDepositBalance?: number; // amount not * by current pricePerShare, raw deposit amount
  userLpDepositBalanceFull?: number;
  userLpDepositBalanceBN: BigNumber;
  userValueUSD?: number;
  totalSupply?: number;
  APR?: number;
  dailyAPR: number;
  APY: number | string;
  totalValueLocked: number;
  tvlChecked: boolean;
  loading: boolean;
  contract?: Contract;
  logoURI: string;
  contractApproved: boolean;
  pricePerShare?: number;
  strategy?: IStrategy;
  strategyContract?: Contract;
  geckoIdToken0?: string;
  geckoIdToken1?: string;
  fetchPriceToken0: () => Promise<number>;
  fetchPriceToken1: () => Promise<number>;
  fetchRewardTokenPrice: () => Promise<number>;
  compoundsDaily: number;
  isSingleStake: boolean;
  isV2?: boolean;
}

export interface IStrategy {
  address: string;
  paused?: boolean;
  withdrawlFee?: number;
  protocolWithdrawFee?: number;
}
