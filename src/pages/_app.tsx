import "~/styles/main.css";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import type { AppProps } from "next/app";
import { pulseChain } from "../lib/pulsechain";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ConnectKitProvider } from "connectkit";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import Layout from "~/components/Layout";
import { ThemeProvider } from "next-themes";
import { publicProvider } from "wagmi/providers/public";

const alchemyId = process.env.ALCHEMY_ID;

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.goerli, pulseChain],
  [
    alchemyProvider({ apiKey: alchemyId }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== pulseChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
    publicProvider(),
  ]
);

const client = createClient({
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
        options={{
          disclaimer: (
            <>
              By connecting your wallet you agree to the
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://en.wikipedia.org/wiki/Terms_of_service"
              >
                Terms of Service
              </a>
              and
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://en.wikipedia.org/wiki/Privacy_policy"
              >
                Privacy Policy
              </a>
            </>
          ),
        }}
      >
        <ThemeProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
