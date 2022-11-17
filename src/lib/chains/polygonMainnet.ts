import { Chain } from "wagmi";

export const polygonMainnet: Chain = {
  id: 137,
  name: "Polygon",
  network: "MATIC",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://polygon-rpc.com/",
  },
  blockExplorers: {
    default: { name: "polygonscan", url: "https://polygonscan.com" },
  },
  testnet: false,
};
