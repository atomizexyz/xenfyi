import { Chain } from "wagmi";

export const fantomMainnet: Chain = {
  id: 250,
  name: "Fantom Opera",
  network: "FTM",
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  rpcUrls: {
    default: "https://rpc.ftm.tools",
  },
  blockExplorers: {
    default: {
      name: "ftmscan",
      url: "https://ftmscan.com",
    },
  },
  testnet: false,
};
