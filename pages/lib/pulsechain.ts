import { Chain } from "wagmi";

export const pulseChain: Chain = {
  id: 941,
  name: "PulseChain Testnet 2b",
  network: "pulse",
  nativeCurrency: {
    decimals: 18,
    name: "Test Pulse",
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
