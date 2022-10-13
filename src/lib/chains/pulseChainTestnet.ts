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
  testnet: true,
};
