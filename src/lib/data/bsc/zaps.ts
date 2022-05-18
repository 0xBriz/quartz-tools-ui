import { ChainZapInfo, IZapPool } from 'src/lib/types/zap.types';
import {
  ASHARE_INPUT_OPTION,
  BNB_INPUT_OPTION,
  BUSD_INPUT_OPTION,
} from '../common/zap-input-options';
import { TOKENS } from '../tokens';
import { PANCAKESWAP_ROUTER_ADDRESS } from './bsc-addresses';
import { PAIR_AMETHYST_BUSD_BSC } from './pairs';
import { VAULT_AMETHYST_BUSD_BSC } from './vaults';

export const ZAP_UST_AMES_BSC: IZapPool = {
  active: true,
  name: 'AMES-BUSD',
  poolId: 9,
  pairAddress: PAIR_AMETHYST_BUSD_BSC,
  token0: null,
  token1: null,
  routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
  pair: null,
  tokenInAddress: null,
  tokenInAmount: null,
  logoPath: 'assets/ames-busd.png',
  tokenInputOptions: [
    // {
    //   ...UST_INPUT_OPTION,
    //   address: TOKENS.UST.BSC,
    //   pathTokenInToLp0: [TOKENS.UST.BSC],
    //   pathTokenInToLp1: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
    // },
    // {
    //   ...BNB_INPUT_OPTION,
    //   address: TOKENS.BNB.BSC,
    //   pathTokenInToLp0: [TOKENS.BNB.BSC, TOKENS.UST.BSC],
    //   pathTokenInToLp1: [TOKENS.BNB.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
    // },
    {
      ...BUSD_INPUT_OPTION,
      address: TOKENS.BUSD.BSC,
      pathTokenInToLp0: [TOKENS.BUSD.BSC, TOKENS.AMETHYST.BSC],
      pathTokenInToLp1: [TOKENS.BUSD.BSC],
    },
  ],
  vault: VAULT_AMETHYST_BUSD_BSC,
};

// export const ZAP_AMES_ASHARE_BSC: IZapPool = {
//   active: true,
//   name: 'AMES-ASHARE',
//   poolId: 5,
//   pairAddress: PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
//   token0: null,
//   token1: null,
//   routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
//   pair: null,
//   tokenInAddress: null,
//   tokenInAmount: null,
//   logoPath: 'assets/ames-ashare-lp-logo.svg',
//   path: [],
//   tokenInputOptions: [
//     {
//       ...ASHARE_INPUT_OPTION,
//       address: TOKENS.ASHARE.BSC,
//       pathTokenInToLp0: [TOKENS.ASHARE.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [TOKENS.ASHARE.BSC],
//     },
//     {
//       ...UST_INPUT_OPTION,
//       address: TOKENS.UST.BSC,
//       pathTokenInToLp0: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [
//         TOKENS.UST.BSC,
//         TOKENS.AMETHYST.BSC,
//         TOKENS.ASHARE.BSC,
//       ],
//     },
//     {
//       ...BUSD_INPUT_OPTION,
//       address: TOKENS.BUSD.BSC,
//       pathTokenInToLp0: [TOKENS.BUSD.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [
//         TOKENS.BUSD.BSC,
//         TOKENS.UST.BSC,
//         TOKENS.AMETHYST.BSC,
//         TOKENS.ASHARE.BSC,
//       ],
//     },
//   ],
//   vault: VAULT_AMETHYST_ASHARE_BSC,
// };

// export const ZAP_AMES_SINGLE_STAKE_BSC: IZapPool = {
//   active: true,
//   name: 'AMES',
//   poolId: 6,
//   pairAddress: PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
//   token0: null,
//   token1: null,
//   routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
//   pair: null,
//   tokenInAddress: null,
//   tokenInAmount: null,
//   logoPath: 'assets/ames-logo.svg',
//   path: [],
//   tokenInputOptions: [
//     {
//       ...ASHARE_INPUT_OPTION,
//       address: TOKENS.ASHARE.BSC,
//       pathTokenInToLp0: [TOKENS.ASHARE.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [TOKENS.ASHARE.BSC],
//     },
//     {
//       ...UST_INPUT_OPTION,
//       address: TOKENS.UST.BSC,
//       pathTokenInToLp0: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [
//         TOKENS.UST.BSC,
//         TOKENS.AMETHYST.BSC,
//         TOKENS.ASHARE.BSC,
//       ],
//     },
//     {
//       ...BUSD_INPUT_OPTION,
//       address: TOKENS.BUSD.BSC,
//       pathTokenInToLp0: [TOKENS.BUSD.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [
//         TOKENS.BUSD.BSC,
//         TOKENS.UST.BSC,
//         TOKENS.AMETHYST.BSC,
//         TOKENS.ASHARE.BSC,
//       ],
//     },
//   ],
// };

export const ZAPS_BSC: ChainZapInfo = {
  ZAPS: [ZAP_UST_AMES_BSC],
};
