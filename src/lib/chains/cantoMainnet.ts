import { Chain } from "wagmi";

export const cantoMainnet: Chain = {
  id: 7700,
  name: "Canto",
  network: "Canto",
  nativeCurrency: {
    decimals: 18,
    name: "Canto",
    symbol: "CANTO",
  },
  rpcUrls: {
    default:
      "https://canto.gravitychain.io/",
  },
  blockExplorers: {
    default: {
      name: "Canto Explorer (Blockscout)",
      url: "https://tuber.build/",
    },
  },
  testnet: false,
};
