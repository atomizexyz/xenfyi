import { Chain } from "wagmi";

export const pulseChain: Chain = {
  id: 369,
  name: "PulseChain",
  network: "pulse chain",
  nativeCurrency: {
    decimals: 18,
    name: "PLS",
    symbol: "PLS",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.pulsechain.com"],
    },
    public: {
      http: ["https://rpc.pulsechain.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Pulse Scan",
      url: "https://scan.pulsechain.com",
    },
  },
  testnet: false,
};
