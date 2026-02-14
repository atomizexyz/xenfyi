import {
  createPublicClient,
  http,
  fallback,
  webSocket,
  type PublicClient,
  type Chain,
  type Transport,
  type HttpTransportConfig,
} from "viem";
import { type ChainConfig, chainConfigs } from "@/config/chains";

// ─── Master-Slave RPC Transport System ───────────────────────────────
// Sources: https://chainlist.org
//
// Architecture per chain:
//   WebSocket Master → WebSocket Slaves → HTTP Master → HTTP Slaves
//
// viem's `fallback()` with `rank: true` automatically:
//   - Measures latency across all transports
//   - Promotes the fastest responding transport to primary
//   - Demotes unhealthy transports to the back of the queue
//   - Retries failed requests across the pool
//
// Master transport = first URL in the array (initial primary)
// Slave transports = remaining URLs (fallback pool, ranked by latency)
// ─────────────────────────────────────────────────────────────────────

const HTTP_TRANSPORT_CONFIG: HttpTransportConfig = {
  timeout: 10_000,
  retryCount: 2,
  retryDelay: 1_000,
  batch: { batchSize: 50, wait: 50 },
};

const WS_CONFIG = {
  timeout: 10_000,
  retryCount: 2,
  retryDelay: 1_000,
};

function createMasterSlaveTransport(config: ChainConfig): Transport {
  // Build WebSocket transports (master first, then slaves)
  const wsTransports = config.wsUrls.map((url) =>
    webSocket(url, WS_CONFIG)
  );

  // Build HTTP transports (master first, then slaves)
  const httpTransports = config.rpcUrls.map((url) =>
    http(url, HTTP_TRANSPORT_CONFIG)
  );

  // Priority: WS master → WS slaves → HTTP master → HTTP slaves
  const allTransports = [...wsTransports, ...httpTransports];

  return fallback(allTransports.length > 0 ? allTransports : [http()], {
    // Rank transports by latency — promotes fastest, demotes failures
    rank: {
      interval: 60_000,      // Re-rank every 60s
      sampleCount: 5,        // Use last 5 requests for ranking
      timeout: 5_000,        // Ranking probe timeout
      weights: {
        latency: 0.4,        // 40% weight on speed
        stability: 0.6,      // 60% weight on reliability
      },
    },
    retryCount: 3,
    retryDelay: 1_500,
  });
}

// ─── Client Cache ────────────────────────────────────────────────────

const clientCache = new Map<number, PublicClient>();

export function getPublicClient(chainId: number): PublicClient {
  const cached = clientCache.get(chainId);
  if (cached) return cached;

  const config = chainConfigs.find((c) => c.chain.id === chainId);
  if (!config) throw new Error(`No chain config for chainId ${chainId}`);

  const transport = createMasterSlaveTransport(config);
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
