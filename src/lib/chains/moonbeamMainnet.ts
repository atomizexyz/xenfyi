import { Chain } from "wagmi";

export const moonbeamMainnet: Chain = {
  id: 1284,
  name: "Moonbeam",
  network: "MOON",
  nativeCurrency: {
    decimals: 18,
    name: "Glimmer",
    symbol: "GLMR",
  },
  rpcUrls: {
    default: "https://rpc.api.moonbeam.network",
  },
  blockExplorers: {
    default: { name: "moonscan", url: "https://moonbeam.moonscan.io" },
  },
  testnet: false,
};
