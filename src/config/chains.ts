import {
  mainnet,
  polygon,
  bsc,
  avalanche,
  moonbeam,
  fantom,
  base,
  optimism,
  dogechain,
  okc,
  pulsechain,
  evmos as viemEvmos,
} from "viem/chains";
import { defineChain } from "viem";
import type { Chain } from "viem";

// Multicall3 canonical address (deployed on 100+ chains)
// https://www.multicall3.com/deployments
const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;

// Extend Evmos with Multicall3 support (viem's definition is missing it)
export const evmos = defineChain({
  ...viemEvmos,
  contracts: {
    multicall3: {
      address: MULTICALL3_ADDRESS,
      blockCreated: 6_695_665,
    },
  },
});

// EthereumPoW - forked from Ethereum post-merge, so Multicall3 exists
// from Ethereum's pre-fork state (deployed at block 14,353,601)
export const ethpow: Chain = {
  id: 10001,
  name: "EthereumPoW",
  nativeCurrency: { name: "ETHW", symbol: "ETHW", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.ethereumpow.org"] },
  },
  blockExplorers: {
    default: { name: "ETHW Explorer", url: "https://www.oklink.com/ethw" },
  },
  contracts: {
    multicall3: {
      address: MULTICALL3_ADDRESS,
      blockCreated: 14_353_601,
    },
  },
};

// Re-export viem chains that already have Multicall3 configured:
// - dogechain: 0x68a8609a60a008EFA633dfdec592c03B030cC508 (block 25384031)
// - okc: 0xcA11bde05977b3631167028862bE2a173976CA11 (block 10364792)
// - pulsechain: 0xcA11bde05977b3631167028862bE2a173976CA11 (block 14353601)
export { dogechain, okc, pulsechain };

// XEN contract addresses per chain
export const xenContracts: Record<number, `0x${string}`> = {
  [mainnet.id]: "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8",
  [polygon.id]: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
  [bsc.id]: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
  [avalanche.id]: "0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389",
  [moonbeam.id]: "0xb564A5767A00Ee9075cAC561c427643286F8F4E1",
  [evmos.id]: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
  [fantom.id]: "0xeF4B763385838FfFc708000f884026B8c0434275",
  [dogechain.id]: "0x948eed4490833D526688fD1E5Ba0b9B35CD2c32e",
  [okc.id]: "0x1cC4D981e897A3D2E7785093A648c0a75fAd0453",
  [ethpow.id]: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
  [base.id]: "0xffcbF84650cE02DaFE96926B37a0ac5E34932fa5",
  [pulsechain.id]: "0x8a7FDcA264e87b6da72D000f22186B4403081A2a",
  [optimism.id]: "0xeB585163DEbB1E637c6D617de3bEF99347cd75c8",
};

export interface ChainConfig {
  chain: Chain;
  slug: string;
  contractAddress: `0x${string}`;
  color: string;
  icon: string;
  rpcUrls: string[];
  wsUrls: string[];
}

export const chainConfigs: ChainConfig[] = [
  {
    chain: mainnet,
    slug: "ethereum",
    contractAddress: xenContracts[mainnet.id]!,
    color: "#627EEA",
    icon: "/images/chains/ethereum.svg",
    rpcUrls: [
      "https://eth.llamarpc.com",
      "https://rpc.ankr.com/eth",
      "https://ethereum-rpc.publicnode.com",
      "https://1rpc.io/eth",
    ],
    wsUrls: [
      "wss://ethereum-rpc.publicnode.com",
    ],
  },
  {
    chain: polygon,
    slug: "polygon",
    contractAddress: xenContracts[polygon.id]!,
    color: "#8247E5",
    icon: "/images/chains/polygon.svg",
    rpcUrls: [
      "https://polygon.llamarpc.com",
      "https://rpc.ankr.com/polygon",
      "https://polygon-bor-rpc.publicnode.com",
      "https://1rpc.io/matic",
    ],
    wsUrls: [
      "wss://polygon-bor-rpc.publicnode.com",
    ],
  },
  {
    chain: bsc,
    slug: "bsc",
    contractAddress: xenContracts[bsc.id]!,
    color: "#F0B90B",
    icon: "/images/chains/bsc.svg",
    rpcUrls: [
      "https://binance.llamarpc.com",
      "https://rpc.ankr.com/bsc",
      "https://bsc-rpc.publicnode.com",
      "https://1rpc.io/bnb",
    ],
    wsUrls: [
      "wss://bsc-rpc.publicnode.com",
    ],
  },
  {
    chain: avalanche,
    slug: "avalanche",
    contractAddress: xenContracts[avalanche.id]!,
    color: "#E84142",
    icon: "/images/chains/avalanche.svg",
    rpcUrls: [
      "https://avalanche.drpc.org",
      "https://rpc.ankr.com/avalanche",
      "https://avalanche-c-chain-rpc.publicnode.com",
      "https://1rpc.io/avax/c",
    ],
    wsUrls: [
      "wss://avalanche-c-chain-rpc.publicnode.com",
    ],
  },
  {
    chain: moonbeam,
    slug: "moonbeam",
    contractAddress: xenContracts[moonbeam.id]!,
    color: "#53CBC9",
    icon: "/images/chains/moonbeam.svg",
    rpcUrls: [
      "https://rpc.api.moonbeam.network",
      "https://rpc.ankr.com/moonbeam",
      "https://moonbeam-rpc.publicnode.com",
      "https://1rpc.io/glmr",
    ],
    wsUrls: [
      "wss://moonbeam-rpc.publicnode.com",
    ],
  },
  {
    chain: evmos,
    slug: "evmos",
    contractAddress: xenContracts[evmos.id]!,
    color: "#ED4E33",
    icon: "/images/chains/evmos.svg",
    rpcUrls: [
      "https://evmos.lava.build",
      "https://evmos-evm-rpc.publicnode.com",
    ],
    wsUrls: [
      "wss://evmos-evm-rpc.publicnode.com",
    ],
  },
  {
    chain: fantom,
    slug: "fantom",
    contractAddress: xenContracts[fantom.id]!,
    color: "#1969FF",
    icon: "/images/chains/fantom.svg",
    rpcUrls: [
      "https://rpc.ftm.tools",
      "https://rpc.ankr.com/fantom",
      "https://fantom-rpc.publicnode.com",
      "https://1rpc.io/ftm",
    ],
    wsUrls: [
      "wss://fantom-rpc.publicnode.com",
    ],
  },
  {
    chain: dogechain,
    slug: "dogechain",
    contractAddress: xenContracts[dogechain.id]!,
    color: "#C3A634",
    icon: "/images/chains/dogechain.svg",
    rpcUrls: [
      "https://rpc.dogechain.dog",
      "https://rpc01-sg.dogechain.dog",
    ],
    wsUrls: [],
  },
  {
    chain: okc,
    slug: "okc",
    contractAddress: xenContracts[okc.id]!,
    color: "#000000",
    icon: "/images/chains/okc.svg",
    rpcUrls: [
      "https://exchainrpc.okex.org",
    ],
    wsUrls: [],
  },
  {
    chain: ethpow,
    slug: "ethpow",
    contractAddress: xenContracts[ethpow.id]!,
    color: "#627EEA",
    icon: "/images/chains/ethpow.svg",
    rpcUrls: [
      "https://mainnet.ethereumpow.org",
    ],
    wsUrls: [],
  },
  {
    chain: base,
    slug: "base",
    contractAddress: xenContracts[base.id]!,
    color: "#0052FF",
    icon: "/images/chains/base.svg",
    rpcUrls: [
      "https://base.llamarpc.com",
      "https://rpc.ankr.com/base",
      "https://base-rpc.publicnode.com",
      "https://1rpc.io/base",
    ],
    wsUrls: [
      "wss://base-rpc.publicnode.com",
    ],
  },
  {
    chain: pulsechain,
    slug: "pulsechain",
    contractAddress: xenContracts[pulsechain.id]!,
    color: "#00FF00",
    icon: "/images/chains/pulsechain.svg",
    rpcUrls: [
      "https://rpc.pulsechain.com",
      "https://pulsechain-rpc.publicnode.com",
    ],
    wsUrls: [
      "wss://pulsechain-rpc.publicnode.com",
    ],
  },
  {
    chain: optimism,
    slug: "optimism",
    contractAddress: xenContracts[optimism.id]!,
    color: "#FF0420",
    icon: "/images/chains/optimism.svg",
    rpcUrls: [
      "https://optimism.llamarpc.com",
      "https://rpc.ankr.com/optimism",
      "https://optimism-rpc.publicnode.com",
      "https://1rpc.io/op",
    ],
    wsUrls: [
      "wss://optimism-rpc.publicnode.com",
    ],
  },
];

export const getChainConfig = (slug: string): ChainConfig | undefined =>
  chainConfigs.find((c) => c.slug === slug);

export const getChainConfigById = (chainId: number): ChainConfig | undefined =>
  chainConfigs.find((c) => c.chain.id === chainId);

export const allChains = chainConfigs.map((c) => c.chain);
