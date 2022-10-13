import { Chain } from "wagmi";

export const avaxMainnet: Chain = {
  id: 43114,
  name: "Avalanche C-Chain",
  network: "AVAX",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://api.avax.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "snowtrace", url: "https://snowtrace.io" },
  },
  testnet: false,
};
