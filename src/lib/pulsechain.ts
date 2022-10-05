import { Chain } from "wagmi";

export const pulseChain: Chain = {
  id: 941,
  name: "PLS Testnet",
  network: "pulse",
  nativeCurrency: {
    decimals: 18,
    name: "PLS Testnet",
    symbol: "tPLS",
  },
  rpcUrls: {
    default: "https://rpc.v2b.testnet.pulsechain.com",
  },
  blockExplorers: {
    default: {
      name: "Pulse Scan",
      url: "https://scan.v2b.testnet.pulsechain.com",
    },
  },
  multicall: {
    address: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
    blockCreated: 12336033,
  },
  testnet: true,
};
