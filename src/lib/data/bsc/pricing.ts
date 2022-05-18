import { getPairInfo } from 'src/lib/utils/dex-screener';
import { PAIR_AMETHYST_BUSD_BSC, PAIR_ASHARE_BUSD_BSC } from './pairs';

export const getAsharePrice = async () => {
  const { pair } = await getPairInfo('bsc', PAIR_ASHARE_BUSD_BSC);

  return Number(pair.priceUsd);
};

export const getAmethystPrice = async () => {
  const { pair } = await getPairInfo('bsc', PAIR_AMETHYST_BUSD_BSC);

  return Number(pair.priceUsd);
};
