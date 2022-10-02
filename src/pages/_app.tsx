import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import type { AppProps } from "next/app";
import { pulseChain } from "../lib/pulsechain";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const alchemyId = process.env.ALCHEMY_ID;

const { provider } = configureChains(
  [chain.mainnet, pulseChain],
  [
    alchemyProvider({ apiKey: alchemyId }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== pulseChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  provider: provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;
