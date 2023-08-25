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
import { Chain, configureChains, createClient } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import { ethpow, x1Testnet } from "~/lib/chains";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;
const quickNodeId137 = process.env.NEXT_PUBLIC_QUICK_NODE_ID_137 as string;
const quickNodeId1 = process.env.NEXT_PUBLIC_QUICK_NODE_ID_1 as string;
const quickNodeId56 = process.env.NEXT_PUBLIC_QUICK_NODE_ID_56 as string;
const quickNodeId43114 = process.env.NEXT_PUBLIC_QUICK_NODE_ID_43114 as string;
const quickNodeId250 = process.env.NEXT_PUBLIC_QUICK_NODE_ID_250 as string;
const quickNodeId8453 = process.env.NEXT_PUBLIC_QUICK_NODE_ID_8453 as string;
const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK as string;

export let allChains: Chain[];

switch (chainNetwork) {
  case "mainnet":
    allChains = [mainnet, polygon, bsc, avalanche, moonbeam, evmos, fantom, dogechain, okc, ethpow, pulsechain, base];
    break;
  case "testnet":
    allChains = [goerli, polygonMumbai, pulsechainV4, x1Testnet];
    break;
  default:
    allChains = [foundry, localhost];
    break;
}

export const { chains, provider, webSocketProvider } = configureChains(allChains, [
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id === mainnet.id) {
        return {
          http: `https://prettiest-powerful-sanctuary.quiknode.pro/${quickNodeId1}/`,
          webSocket: `wss://prettiest-powerful-sanctuary.quiknode.pro/${quickNodeId1}/`,
        };
      } else if (chain.id === polygon.id) {
        return {
          http: `https://still-autumn-feather.matic.discover.quiknode.pro/${quickNodeId137}/`,
          webSocket: `wss://still-autumn-feather.matic.discover.quiknode.pro/${quickNodeId137}/`,
        };
      } else if (chain.id === bsc.id) {
        return {
          http: `https://side-summer-silence.bsc.quiknode.pro/${quickNodeId56}/`,
          webSocket: `wss://side-summer-silence.bsc.quiknode.pro/${quickNodeId56}/`,
        };
      } else if (chain.id === avalanche.id) {
        return {
          http: `https://frequent-sleek-sea.avalanche-mainnet.quiknode.pro/${quickNodeId43114}/ext/bc/C/rpc/`,
          webSocket: `wss://frequent-sleek-sea.avalanche-mainnet.quiknode.pro/${quickNodeId43114}/ext/bc/C/ws/`,
        };
      } else if (chain.id === fantom.id) {
        return {
          http: `https://ultra-late-field.fantom.quiknode.pro/${quickNodeId250}/`,
          webSocket: `wss://ultra-late-field.fantom.quiknode.pro/${quickNodeId250}/`,
        };
      } else if (chain.id === base.id) {
        return {
          http: `https://crimson-alien-water.base-mainnet.quiknode.pro/${quickNodeId8453}/`,
          webSocket: `wss://crimson-alien-water.base-mainnet.quiknode.pro/${quickNodeId8453}/`,
        };
      } else if (chain.id === goerli.id) {
        return {
          http: `https://rpc.ankr.com/eth_goerli`,
        };
      } else if (chain.id === evmos.id) {
        return {
          http: `https://evmos-mainnet.public.blastapi.io`,
        };
      } else if (chain.id === dogechain.id) {
        return {
          http: `https://rpc.ankr.com/dogechain`,
        };
      } else {
        return null;
      }
    },
    priority: 0,
  }),
  alchemyProvider({ apiKey: alchemyId, priority: 1 }),
  infuraProvider({ apiKey: infuraId, priority: 1 }),
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
