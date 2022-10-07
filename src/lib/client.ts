import { createClient, configureChains, chain } from "wagmi";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { bscTestnet } from "./bscTestnet";
import { pulseChain } from "~/lib/pulseChain";

const alchemyId = process.env.ALCHEMY_ID;
const infuraId = process.env.INFURA_ID;

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, bscTestnet, chain.goerli, pulseChain, chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: alchemyId, priority: 0 }),
    infuraProvider({ apiKey: infuraId, priority: 0 }),
    jsonRpcProvider({
      priority: 0,
      rpc: (chain) => {
        if (chain.id !== pulseChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
    publicProvider({ priority: 1 }),
  ]
);

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
