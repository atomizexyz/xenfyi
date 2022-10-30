import { Chain } from "wagmi";

export const bscMainnet: Chain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "BSC",
  rpcUrls: {
    default: "https://bsc-dataseed1.binance.org",
    "bsc-dataseed1.binance": "https://bsc-dataseed1.binance.org",
    "bsc-dataseed2.binance": "https://bsc-dataseed2.binance.org",
    "bsc-dataseed3.binance": "https://bsc-dataseed3.binance.org",
    "bsc-dataseed4.binance": "https://bsc-dataseed4.binance.org",
    "bsc-dataseed1.defibit": "https://bsc-dataseed1.defibit.io",
    "bsc-dataseed2.defibit": "https://bsc-dataseed2.defibit.io",
    "bsc-dataseed3.defibit": "https://bsc-dataseed3.defibit.io",
    "bsc-dataseed4.defibit": "https://bsc-dataseed4.defibit.io",
    "bsc-dataseed1.ninicoin": "https://bsc-dataseed1.ninicoin.io",
    "bsc-dataseed2.ninicoin": "https://bsc-dataseed2.ninicoin.io",
    "bsc-dataseed3.ninicoin": "https://bsc-dataseed3.ninicoin.io",
    "bsc-dataseed4.ninicoin": "https://bsc-dataseed4.ninicoin.io",
    "bsc-ws-node.nariox": "wss://bsc-ws-node.nariox.org",
  },
  nativeCurrency: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: "BscScan",
      url: "https://bscscan.com",
    },
  },
  testnet: false,
};
