export const REWARD_POOL_ABI = [
  {
    type: 'function',
    name: 'userInfo',
    outputs: [
      {
        internalType: 'uint256',
        type: 'uint256',
        name: 'amount',
      },
      {
        name: 'rewardDebt',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    inputs: [
      {
        internalType: 'uint256',
        type: 'uint256',
        name: '',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'address',
        internalType: 'contract IERC20',
        name: 'token',
      },
      {
        name: 'allocPoint',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'lastRewardTime',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'accUSharePerShare',
        internalType: 'uint256',
      },
      {
        name: 'isStarted',
        internalType: 'bool',
        type: 'bool',
      },
    ],
    inputs: [
      {
        type: 'uint256',
        internalType: 'uint256',
        name: '',
      },
    ],
    name: 'poolInfo',
  },
  {
    type: 'function',
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
    inputs: [],
    name: 'totalAllocPoint',
  },
  {
    inputs: [],
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        internalType: 'uint256',
        name: '',
      },
    ],
    name: 'tSharePerSecond',
    type: 'function',
  },
  {
    outputs: [],
    name: 'deposit',
    inputs: [
      {
        name: '_pid',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    type: 'function',
    stateMutability: 'nonpayable',
  },
];
