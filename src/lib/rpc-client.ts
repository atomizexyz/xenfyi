import { createPublicClient, http, fallback, webSocket, type PublicClient, type Chain, type Transport } from "viem";
import { type ChainConfig, chainConfigs } from "@/config/chains";

function createTransportsForChain(config: ChainConfig): Transport {
  const httpTransports = config.rpcUrls.map((url) =>
    http(url, {
      timeout: 10_000,
      retryCount: 2,
      retryDelay: 1_000,
      batch: { batchSize: 50, wait: 50 },
    })
  );

  const wsTransports = config.wsUrls.map((url) =>
    webSocket(url, { timeout: 10_000, retryCount: 2, retryDelay: 1_000 })
  );

  // WebSocket first (for subscriptions), then HTTP fallbacks
  const allTransports = [...wsTransports, ...httpTransports];

  return fallback(allTransports.length > 0 ? allTransports : [http()], {
    rank: true,
    retryCount: 3,
    retryDelay: 1_500,
  });
}

const clientCache = new Map<number, PublicClient>();

export function getPublicClient(chainId: number): PublicClient {
  const cached = clientCache.get(chainId);
  if (cached) return cached;

  const config = chainConfigs.find((c) => c.chain.id === chainId);
  if (!config) throw new Error(`No chain config for chainId ${chainId}`);

  const transport = createTransportsForChain(config);
  const client = createPublicClient({
    chain: config.chain as Chain,
    transport,
    batch: { multicall: { batchSize: 512, wait: 50 } },
  });

  clientCache.set(chainId, client as PublicClient);
  return client as PublicClient;
}

export function getAllPublicClients(): Map<number, PublicClient> {
  for (const config of chainConfigs) {
    getPublicClient(config.chain.id);
  }
  return clientCache;
}
