export const ZAPPER_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'who',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'pairAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'lpAmount',
        type: 'uint256',
      },
    ],
    name: 'ZappedInLP',
    type: 'event',
  },
  {
    inputs: [],
    name: 'devAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenInAmount',
        type: 'uint256',
      },
    ],
    name: 'quoteFeeAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenAmountAfterFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_treasuryAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_devAddress',
        type: 'address',
      },
    ],
    name: 'setFeeReceivers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasuryAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_fee',
        type: 'uint256',
      },
    ],
    name: 'updateZapFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'zapFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenInAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_pairAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenInAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_routerAddress',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_pathTokenInToLp0',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_pathTokenInToLp1',
        type: 'address[]',
      },
    ],
    name: 'zapInWithPath',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
