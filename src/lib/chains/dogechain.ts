import { Chain } from "wagmi";

export const dogechain: Chain = {
  id: 2000,
  name: "Dogechain",
  network: "dogechain mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Dogecoin",
    symbol: "DOGE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.dogechain.dog"],
    },
    public: {
      http: [
        "https://dogechain.ankr.com",
        "https://rpc01.dogechain.dog",
        "https://dogechain-sj.ankr.com",
        "https://rpc03-sg.dogechain.dog",
        "https://rpc02-sg.dogechain.dog",
        "https://rpc01-sg.dogechain.dog",
        "https://rpc-sg.dogechain.dog",
        "https://rpc-us.dogechain.dog",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "dogechain explorer",
      url: "https://explorer.dogechain.dog",
    },
  },
  testnet: false,
};
