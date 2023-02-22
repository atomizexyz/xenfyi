import { Chain } from "wagmi";

export const x1Testnet: Chain = {
  id: 202212,
  name: "X1 Devnet",
  network: "X1",
  nativeCurrency: {
    name: "XN",
    symbol: "XN",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://x1-devnet.xen.network",
  },
  blockExplorers: {
    default: { name: "1x Explorer", url: "https://explorer.x1-devnet.xen.network" },
  },
  testnet: true,
};
