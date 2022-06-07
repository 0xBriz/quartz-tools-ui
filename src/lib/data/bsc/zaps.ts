import { ChainZapInfo, IZapPool } from 'src/lib/types/zap.types';
import {
  ASHARE_INPUT_OPTION,
  BNB_INPUT_OPTION,
  BUSD_INPUT_OPTION,
  USDC_INPUT_OPTION,
} from '../common/zap-input-options';
import { TOKENS } from '../tokens';
import {
  PANCAKESWAP_ROUTER_ADDRESS,
  VAULT_AMETHYST_BUSD_ADDRESS_BSC,
  VAULT_ASHARE_BUSD_ADDRESS_BSC,
} from './bsc-addresses';
import { PAIR_AMETHYST_BUSD_BSC, PAIR_ASHARE_BUSD_BSC } from './pairs';

export const ZAP_AMES_BUSD_BSC: IZapPool = {
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
    //   ...BNB_INPUT_OPTION,
    //   address: TOKENS.BNB.BSC,
    //   pathTokenInToLp0: [TOKENS.BNB.BSC, TOKENS.UST.BSC],
    //   pathTokenInToLp1: [TOKENS.BNB.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
    // },
    {
      ...ASHARE_INPUT_OPTION,
      address: TOKENS.ASHARE.BSC,
      pathTokenInToLp0: [
        TOKENS.ASHARE.BSC,
        TOKENS.BUSD.BSC,
        TOKENS.AMETHYST.BSC,
      ],
      pathTokenInToLp1: [TOKENS.ASHARE.BSC, TOKENS.BUSD.BSC],
    },
    {
      ...BUSD_INPUT_OPTION,
      address: TOKENS.BUSD.BSC,
      pathTokenInToLp0: [TOKENS.BUSD.BSC, TOKENS.AMETHYST.BSC],
      pathTokenInToLp1: [TOKENS.BUSD.BSC],
    },
    {
      ...USDC_INPUT_OPTION,
      address: TOKENS.USDC.BSC,
      pathTokenInToLp0: [TOKENS.USDC.BSC, TOKENS.BUSD.BSC, TOKENS.AMETHYST.BSC],
      pathTokenInToLp1: [TOKENS.USDC.BSC, TOKENS.BUSD.BSC],
    },
  ],
  vaultAddress: VAULT_AMETHYST_BUSD_ADDRESS_BSC,
};

export const ZAP_ASHARE_BUSD_BSC: IZapPool = {
  active: true,
  name: 'ASHARE-BUSD',
  poolId: 8,
  pairAddress: PAIR_ASHARE_BUSD_BSC,
  token0: null,
  token1: null,
  routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
  pair: null,
  tokenInAddress: null,
  tokenInAmount: null,
  logoPath: 'assets/ashare-busd.png',
  tokenInputOptions: [
    // {
    //   ...BNB_INPUT_OPTION,
    //   address: TOKENS.BNB.BSC,
    //   pathTokenInToLp0: [TOKENS.BNB.BSC, TOKENS.UST.BSC],
    //   pathTokenInToLp1: [TOKENS.BNB.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
    // },
    {
      ...BUSD_INPUT_OPTION,
      address: TOKENS.BUSD.BSC,
      pathTokenInToLp0: [TOKENS.BUSD.BSC],
      pathTokenInToLp1: [TOKENS.BUSD.BSC, TOKENS.ASHARE.BSC],
    },
    {
      ...USDC_INPUT_OPTION,
      address: TOKENS.USDC.BSC,
      pathTokenInToLp0: [TOKENS.USDC.BSC, TOKENS.BUSD.BSC],
      pathTokenInToLp1: [TOKENS.USDC.BSC, TOKENS.BUSD.BSC, TOKENS.ASHARE.BSC],
    },
    {
      ...ASHARE_INPUT_OPTION,
      address: TOKENS.ASHARE.BSC,
      pathTokenInToLp0: [TOKENS.ASHARE.BSC, TOKENS.BUSD.BSC],
      pathTokenInToLp1: [TOKENS.ASHARE.BSC],
    },
  ],
  vaultAddress: VAULT_ASHARE_BUSD_ADDRESS_BSC,
};

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
  ZAPS: [ZAP_AMES_BUSD_BSC, ZAP_ASHARE_BUSD_BSC],
};
