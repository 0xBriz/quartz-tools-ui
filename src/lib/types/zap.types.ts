import { ethers } from 'ethers';
import { ERC20 } from './classes/erc20';
import { Pair } from './classes/pair';
import { IVault } from './vault.types';

export type ZapDestination = 'Vault' | 'Farm';

// Required arguments to contract zapInWithPath function
export interface ZapContractArgs {
  tokenInAddress: string;
  pairAddress: string;
  tokenInAmountBN: ethers.BigNumber;
  routerAddress: string;
  path: string[];
}

export interface ZapInput {
  tokenInAddress: string;
  pairAddress: string;
  tokenInAmount: number;
  tokenInAmountBN?: ethers.BigNumber;
  path?: string[]; // optional to allow being set later
}

export interface IZapPool extends ZapInput {
  // UI items and helpers
  active: boolean;
  loading?: boolean;
  name: string;
  token0: ERC20;
  token1: ERC20;
  pair?: Pair;
  userBalanceToken0?: number;
  userBalanceToken1?: number;
  logoPath: string;
  routerAddress: string;
  tokenInputOptions?: TokenInputOption[];
  poolId: number;
  vault?: IVault;
}

export interface IZapResult {
  lpTokensUI: number;
  lpTokensBN: ethers.BigNumber;
}

export type TokenZapPathMap = { [tokenAddress: string]: string[] };

export interface TokenInputOption {
  tokenName: string;
  address: string;
  logoPath: string;
  userBalanceUI?: number;
  userBalanceBN?: ethers.BigNumber;
  loadingBalance?: boolean;
  pathTokenInToLp0: string[];
  pathTokenInToLp1: string[];
}

export interface ChainZapInfo {
  ZAPS: IZapPool[];
}

export interface ChainZapData {
  [chainId: number]: ChainZapInfo;
}
