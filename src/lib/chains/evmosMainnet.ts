import { Chain } from "wagmi";

export const evmosMainnet: Chain = {
  id: 9001,
  name: "Evmos",
  network: "Evmos",
  nativeCurrency: {
    decimals: 18,
    name: "Evmos",
    symbol: "EVMOS",
  },
  rpcUrls: {
    default: "https://eth.bd.evmos.org:8545",
  },
  blockExplorers: {
    default: {
      name: "Evmos EVM Explorer (Blockscout)",
      url: "https://evm.evmos.org",
    },
    mintscan: {
      name: "Evmos Cosmos Explorer (Mintscan)",
      url: "https://www.mintscan.io/evmos",
    },
  },
  testnet: false,
};
