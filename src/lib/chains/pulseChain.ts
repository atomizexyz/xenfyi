import { Chain } from "wagmi";

export const pulseChain: Chain = {
  id: 942,
  name: "PLS Testnet",
  network: "pulse",
  nativeCurrency: {
    decimals: 18,
    name: "PLS Testnet",
    symbol: "tPLS",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.v3.testnet.pulsechain.com"],
    },
    public: {
      http: ["https://rpc.v3.testnet.pulsechain.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Pulse Scan",
      url: "https://scan.v3.testnet.pulsechain.com",
    },
  },
  testnet: true,
};
