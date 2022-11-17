import { Chain } from "wagmi";

export const polygonTestnet: Chain = {
  id: 80001,
  name: "Polygon Testnet",
  network: "Polygon",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://matic-mumbai.chainstacklabs.com",
  },
  blockExplorers: {
    default: { name: "polygonscan", url: "https://mumbai.polygonscan.com" },
  },
  testnet: true,
};
