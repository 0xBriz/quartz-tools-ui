import { IVault } from '../types/vault.types';
import { VAULTS_BSC } from './bsc/vaults';
import { BINANCE_SMART_CHAIN, HARDHAT_CHAIN, HARMONY_CHAIN } from './chains';
import { VAULTS_HARMONY } from './harmony/vaults';

export const VAULTS: { [chainId: number]: IVault[] } = {
  [BINANCE_SMART_CHAIN.chainId]: VAULTS_BSC,
  [HARMONY_CHAIN.chainId]: VAULTS_HARMONY,
  [HARDHAT_CHAIN.chainId]: VAULTS_BSC,
};
