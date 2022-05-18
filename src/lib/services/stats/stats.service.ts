import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { CHAIN_ID_MAP } from 'src/lib/data/chains';
import { ERC20 } from 'src/lib/types/classes/erc20';
import { Pair } from 'src/lib/types/classes/pair';
import { IVault } from 'src/lib/types/vault.types';
import { FormattedResult, roundDecimals } from 'src/lib/utils/formatting';
import { ERC20TokenBase } from '../../types/classes/erc20-token-base';
import { RewardPool } from '../reward-pool/reward-pool';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(
    private readonly web3: Web3Service,
    private readonly rewardPool: RewardPool
  ) {}

  async getVaultUserStats(vaultRef: IVault, userAddress: string) {
    try {
      try {
        let userWalletBalance: FormattedResult;
        if (vaultRef.isSingleStake) {
          const stakeToken = new ERC20(
            vaultRef.lpAddress,
            this.web3.web3Info.signer
          );
          userWalletBalance = await stakeToken.balanceOf(userAddress);
        } else {
          const pair = new Pair(vaultRef.lpAddress, this.web3.web3Info.signer);
          userWalletBalance = await pair.balanceOf(userAddress);
        }

        // Value of users balance
        const walletBalanceBN: ethers.BigNumber = userWalletBalance.value;

        const str = ethers.utils.formatEther(userWalletBalance.value);
        userWalletBalance = new FormattedResult(
          ethers.utils.parseEther((+str).toFixed(12))
        );

        let userLpWalletBalance;

        if (userWalletBalance.toNumber() > 0.0000001) {
          userLpWalletBalance = Number(
            ethers.utils.formatEther(userWalletBalance.value)
          );
        } else {
          userLpWalletBalance = 0;
        }

        console.log('User wallet LP: ' + userLpWalletBalance);

        let [pricePerFullShare, userLpDepositBalanceBN] = await Promise.all([
          vaultRef.contract.getPricePerFullShare(),
          vaultRef.contract.balanceOf(userAddress),
        ]);

        const pricePerShare = new FormattedResult(pricePerFullShare).toNumber();
        const userAmountTimesPricePerShare =
          new FormattedResult(userLpDepositBalanceBN).toNumber() *
          pricePerShare;

        const userLpDepositBalanceFull = userLpDepositBalanceBN.isZero()
          ? 0
          : userAmountTimesPricePerShare;
        const userLpDepositBalanceUI = userLpDepositBalanceBN.isZero()
          ? 0
          : roundDecimals(userAmountTimesPricePerShare, 12);

        return {
          walletBalanceBN,
          userLpWalletBalance,
          pricePerShare,
          userLpDepositBalanceFull,
          userLpDepositBalanceUI,
          userLpDepositBalanceBN,
        };
      } catch (error) {}
    } catch (error) {
      console.error(error);
      throw new Error(`Error getting vault stats: ${vaultRef.name}`);
    }
  }

  async getVaultTVL(vault: IVault) {
    let stats;
    if (vault.isSingleStake) {
      stats = await this.getSingleStakeTVL(vault);
    } else {
      stats = await this.getPairVaultTVL(vault);
    }
    return stats;
  }

  async getPairVaultTVL(vault: IVault) {
    const pair = new Pair(vault.lpAddress, this.web3.web3Info.signer);

    const { totalValueOfChefPoolUSD, chefLpBalance } =
      await this.getChefInfoForPair(pair, vault);

    const vaultTVL = await this.getStrategyTVL(
      vault,
      totalValueOfChefPoolUSD,
      chefLpBalance.toNumber()
    );

    vault.totalValueLocked = vaultTVL;

    const { userValueUSD } = await this.getUserVaultInfo(vault);
    vault.userValueUSD = userValueUSD;

    const { APR, dailyAPR, APY } = await this.getVaultAPRs(
      vault,
      totalValueOfChefPoolUSD
    );

    return {
      vaultTVL,
      APR,
      dailyAPR,
      APY,
    };
  }

  async getUserVaultInfo(vault: IVault) {
    let [vaultTotalSupply, userBalance] = await Promise.all([
      vault.contract.totalSupply(),
      vault.contract.balanceOf(this.web3.web3Info.userAddress),
    ]);
    vaultTotalSupply = new FormattedResult(vaultTotalSupply);
    userBalance = new FormattedResult(userBalance);

    const userPercentOfStrat =
      userBalance.toNumber(4) / vaultTotalSupply.toNumber(4);

    const userValueUSD = userPercentOfStrat * vault.totalValueLocked;

    return {
      userValueUSD,
    };
  }

  private async getChefInfo(tokenContract: ERC20TokenBase) {
    const totalSupply = await tokenContract.totalSupply();
    const chefLpBalance = await tokenContract.balanceOf(
      this.rewardPool.contract.address
    );

    // Get rewards % ownership of the pairs total supply
    const chefPercentOwnership =
      chefLpBalance.toNumber(4) / totalSupply.toNumber(4);

    return {
      totalSupply: totalSupply.toNumber(),
      chefLpBalance,
      chefPercentOwnership,
    };
  }

  async getChefInfoForPair(pair: Pair, vault: IVault) {
    const { pairToken0Amount, pairToken1Amount, pairTotalSupply } =
      await this._getPairTokenInfo(pair);

    const { chefLpBalance, chefPercentOwnership } = await this.getChefInfo(
      pair
    );

    const chefPercentOfToken0 =
      pairToken0Amount.toNumber() * chefPercentOwnership;
    const chefPercentOfToken1 =
      pairToken1Amount.toNumber() * chefPercentOwnership;

    const [priceToken0, priceToken1] = await Promise.all([
      vault.fetchPriceToken0(),
      vault.fetchPriceToken1(),
    ]);

    // The percentage of token0 and token1 for the pool * their price
    // will gives us the total current USD value of the chefs pool
    const poolValueUsdToken0 = chefPercentOfToken0 * priceToken0;
    const poolValueUsdToken1 = chefPercentOfToken1 * priceToken1;
    const totalValueOfChefPoolUSD = poolValueUsdToken0 + poolValueUsdToken1;

    return {
      totalValueOfChefPoolUSD,
      chefLpBalance,
    };
  }

  private async _getPairTokenInfo(pair: Pair) {
    const [token0, token1] = await Promise.all([pair.token0(), pair.token1()]);
    const t0 = new ERC20(token0, this.web3.web3Info.signer);
    const t1 = new ERC20(token1, this.web3.web3Info.signer);

    let [pairToken0Amount, pairToken1Amount, pairTotalSupply] =
      await Promise.all([
        t0.balanceOf(pair.address), // Same idea as `getReserves()` on the pair
        t1.balanceOf(pair.address), // Same idea as `getReserves()` on the pair
        pair.totalSupply(),
      ]);

    return {
      pairToken0Amount,
      pairToken1Amount,
      pairTotalSupply,
    };
  }

  private async getStrategyTVL(
    vault: IVault,
    totalValueOfChefPoolUSD: number,
    chefLpBalance: number
  ) {
    const stratInfo = await this.rewardPool.userInfo(
      vault.poolId,
      vault.strategy.address
    );

    const stratLpBalance = new FormattedResult(stratInfo.amount);
    const stakingTokenPrice = totalValueOfChefPoolUSD / chefLpBalance;
    return stratLpBalance.toNumber() * stakingTokenPrice;
  }

  async getSingleStakeTVL(vault: IVault) {
    const stakeToken = new ERC20(vault.lpAddress, this.web3.web3Info.signer);

    const { totalSupply, chefLpBalance, chefPercentOwnership } =
      await this.getChefInfo(stakeToken);

    const chefPercentOfToken0 = totalSupply * chefPercentOwnership;
    const tokenPrice = await vault.fetchPriceToken0();

    const poolValueUsdToken0 = chefPercentOfToken0 * tokenPrice;
    const totalValueOfChefPoolUSD = poolValueUsdToken0;

    // TVL really comes through the strategies
    const vaultTVL = await this.getStrategyTVL(
      vault,
      totalValueOfChefPoolUSD,
      chefLpBalance.toNumber()
    );

    const userBalance = new FormattedResult(
      await vault.contract.balanceOf(this.web3.web3Info.userAddress)
    );

    const vaultTotalSupply = new FormattedResult(
      await vault.contract.totalSupply()
    );
    const userPercentOfStrat =
      userBalance.toNumber() / vaultTotalSupply.toNumber();
    const userActualValue = userPercentOfStrat * vaultTVL;
    vault.userValueUSD = userActualValue;

    vault.totalValueLocked = vaultTVL;

    const { APR, dailyAPR, APY } = await this.getVaultAPRs(
      vault,
      totalValueOfChefPoolUSD
    );

    return {
      vaultTVL,
      APR,
      dailyAPR,
      APY,
    };
  }

  async getVaultAPRs(vault: IVault, poolTVL: number) {
    const chain = CHAIN_ID_MAP[this.web3.web3Info.chainId];

    const [rewardsPerSecond, rewardTokenPrice] = await Promise.all([
      this.rewardPool.rewardsPerSecond(),
      vault.fetchRewardTokenPrice(),
    ]);

    const rewardTokensPerBlock =
      rewardsPerSecond.toNumber() * chain.blockTimeSeconds;
    const yearlyRewardsValue =
      rewardTokenPrice * rewardTokensPerBlock * chain.blocksPerYear;

    const { poolWeight } = await this.getPoolDataForAPR(vault.poolId);
    const poolsRewardTokenPerYear = yearlyRewardsValue * poolWeight.toNumber();
    const APR = (poolsRewardTokenPerYear / poolTVL) * 100;
    const dailyAPR = roundDecimals(APR / 365, 2);

    return {
      APR: roundDecimals(APR, 2),
      dailyAPR,
      APY: this.getAPY(dailyAPR),
    };
  }

  // TODO: APR's are too high and show inifinte sometimes
  // Need to convert to string and show something like "9.2m%"
  getAPY(dailyAPR: number) {
    const dailyToPercent = dailyAPR / 100;
    const dailyCompoundResults = (1 + dailyToPercent) ** 365;
    return dailyCompoundResults;
  }

  async getPoolDataForAPR(poolId: number) {
    const [poolInfo, totalAllocationPoints] = await Promise.all([
      this.rewardPool.poolInfo(poolId),
      this.rewardPool.totalAllocPoints(),
    ]);

    const poolAllocPoints = new FormattedResult(poolInfo.allocPoint);
    const poolWeight = new FormattedResult(
      ethers.utils.parseUnits(
        String(poolAllocPoints.toNumber(4) / totalAllocationPoints.toNumber(4))
      )
    );

    return {
      poolAllocPoints,
      totalAllocationPoints,
      poolWeight,
    };
  }
}
