export const claimRankFunction = [
  {
    inputs: [{ internalType: "uint256", name: "term", type: "uint256" }],
    name: "claimRank",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const claimMintRewardFunction = [
  {
    inputs: [],
    name: "claimMintReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const claimMintRewardAndShareFunction = [
  {
    inputs: [
      { internalType: "address", name: "other", type: "address" },
      { internalType: "uint256", name: "pct", type: "uint256" },
    ],
    name: "claimMintRewardAndShare",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const claimMintRewardAndStakeFunction = [
  {
    inputs: [
      { internalType: "uint256", name: "pct", type: "uint256" },
      { internalType: "uint256", name: "term", type: "uint256" },
    ],
    name: "claimMintRewardAndStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const stakeFunction = [
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "term", type: "uint256" },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const withdrawFunction = [
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const burnFunction = [
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// READ
export const getUserMintFunction = [
  {
    inputs: [],
    name: "getUserMint",
    outputs: [
      {
        components: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint256", name: "term", type: "uint256" },
          {
            internalType: "uint256",
            name: "maturityTs",
            type: "uint256",
          },
          { internalType: "uint256", name: "rank", type: "uint256" },
          { internalType: "uint256", name: "amplifier", type: "uint256" },
          { internalType: "uint256", name: "eaaRate", type: "uint256" },
        ],
        internalType: "struct XENCrypto.MintInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const getUserStakeFunction = [
  {
    inputs: [],
    name: "getUserStake",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "term", type: "uint256" },
          {
            internalType: "uint256",
            name: "maturityTs",
            type: "uint256",
          },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "apy", type: "uint256" },
        ],
        internalType: "struct XENCrypto.StakeInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
