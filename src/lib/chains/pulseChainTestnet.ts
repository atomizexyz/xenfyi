import { Chain } from "wagmi";

export const pulseChainTestnet: Chain = {
  id: 942,
  name: "PLS Testnet v4",
  network: "pulse",
  nativeCurrency: {
    decimals: 18,
    name: "PLS Testnet",
    symbol: "tPLS",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.v4.testnet.pulsechain.com"],
    },
    public: {
      http: ["https://rpc.v4.testnet.pulsechain.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Pulse Scan",
      url: "https://scan.v4.testnet.pulsechain.com",
    },
  },
  testnet: true,
};
