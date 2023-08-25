import {
  avalanche,
  base,
  bsc,
  dogechain,
  evmos,
  fantom,
  foundry,
  goerli,
  localhost,
  mainnet,
  moonbeam,
  okc,
  polygon,
  polygonMumbai,
  pulsechain,
  pulsechainV4,
} from "@wagmi/chains";
import { configureChains, createClient } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { ethpow, x1Testnet } from "~/lib/chains";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;

export const chainList = [
  mainnet,
  bsc,
  polygon,
  avalanche,
  ethpow,
  moonbeam,
  evmos,
  fantom,
  dogechain,
  okc,
  goerli,
  polygonMumbai,
  foundry,
  localhost,
  x1Testnet,
  pulsechain,
  pulsechainV4,
  base,
];

export const { chains, provider, webSocketProvider } = configureChains(chainList, [
  alchemyProvider({ apiKey: alchemyId, priority: 0 }),
  infuraProvider({ apiKey: infuraId, priority: 0 }),
  publicProvider({ priority: 1 }),
]);

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: false,
        shimChainChangedDisconnect: false,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "xen.fyi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: false,
      },
    }),
  ],
  provider,
  webSocketProvider,
});
