import { Chain } from "wagmi";

export const polygonMainnet: Chain = {
  id: 137,
  name: "Polygon",
  network: "Polygon",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://polygon-rpc.com",
    "rpc-mainnet.matic": "https://rpc-mainnet.matic.network",
    "matic-mainnet.chainstacklab": "https://matic-mainnet.chainstacklabs.com",
    "rpc-mainnet.maticvigil": "https://rpc-mainnet.maticvigil.com",
    "rpc-mainnet.matic.quiknode": "https://rpc-mainnet.matic.quiknode.pro",
    "matic-mainnet-full-rpc.bwarelabs":
      "https://matic-mainnet-full-rpc.bwarelabs.com",
  },
  blockExplorers: {
    default: { name: "Polygonscan", url: "https://polygonscan.com" },
  },
  testnet: false,
};
