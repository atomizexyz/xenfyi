import { getDefaultConfig } from "connectkit";
import { createConfig, http, fallback } from "wagmi";
import { allChains, chainConfigs } from "@/config/chains";

const transports: Record<number, ReturnType<typeof fallback>> = {};

for (const config of chainConfigs) {
  transports[config.chain.id] = fallback(
    config.rpcUrls.map((url) => http(url, { timeout: 10_000, retryCount: 2 }))
  );
}

export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: allChains as [typeof allChains[0], ...typeof allChains],
    transports,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "XEN Crypto",
    appDescription: "XEN Crypto - Cryptocurrency For The Masses",
    appUrl: "https://xen.fyi",
    appIcon: "/images/xen-logo.svg",
  })
);
