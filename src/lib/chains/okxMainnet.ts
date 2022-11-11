import { Chain } from "wagmi";

export const okxMainnet: Chain = {
  id: 66,
  name: "OKXChain",
  network: "OKT",
  nativeCurrency: {
    name: "OK Token",
    symbol: "OKT",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://exchainrpc.okex.org",
  },
  blockExplorers: {
    default: { name: "oklink", url: "https://www.oklink.com/en/okc" },
  },
  testnet: false,
};
