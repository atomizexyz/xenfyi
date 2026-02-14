import { chainConfigs } from "@/config/chains";

export interface TokenPrice {
  chainId: number;
  chainSlug: string;
  priceUsd: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  pairAddress: string;
  dexId: string;
}

// Map chain IDs to DexScreener chain slugs
const dexScreenerChainMap: Record<number, string> = {
  1: "ethereum",
  137: "polygon",
  56: "bsc",
  43114: "avalanche",
  1284: "moonbeam",
  9001: "evmos",
  250: "fantom",
  2000: "dogechain",
  66: "okexchain",
  10001: "ethereumpow",
  8453: "base",
  369: "pulsechain",
  10: "optimism",
};

// XEN token addresses on each chain (same as contract addresses)
const xenTokenAddresses: Record<number, string> = {};
for (const config of chainConfigs) {
  xenTokenAddresses[config.chain.id] = config.contractAddress;
}

export async function fetchXenPrices(): Promise<TokenPrice[]> {
  const prices: TokenPrice[] = [];

  // DexScreener API: fetch token pairs by address for major chains
  // We batch requests by building search queries
  const majorChains = [1, 137, 56, 43114, 8453, 10, 250]; // Most liquid chains

  const fetchPromises = majorChains.map(async (chainId) => {
    const dexChain = dexScreenerChainMap[chainId];
    const tokenAddress = xenTokenAddresses[chainId];

    if (!dexChain || !tokenAddress) return null;

    try {
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
        {
          headers: { Accept: "application/json" },
          next: { revalidate: 60 }, // Cache for 60 seconds
        }
      );

      if (!res.ok) return null;

      const data = await res.json();

      if (!data.pairs || data.pairs.length === 0) return null;

      // Find the best pair (highest liquidity on the target chain)
      const chainPairs = data.pairs.filter(
        (p: { chainId: string }) => p.chainId === dexChain
      );

      if (chainPairs.length === 0) return null;

      // Sort by liquidity USD descending
      const bestPair = chainPairs.sort(
        (a: { liquidity?: { usd: number } }, b: { liquidity?: { usd: number } }) =>
          (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
      )[0];

      const config = chainConfigs.find((c) => c.chain.id === chainId);

      return {
        chainId,
        chainSlug: config?.slug ?? "",
        priceUsd: parseFloat(bestPair.priceUsd ?? "0"),
        priceChange24h: bestPair.priceChange?.h24 ?? 0,
        volume24h: bestPair.volume?.h24 ?? 0,
        liquidity: bestPair.liquidity?.usd ?? 0,
        pairAddress: bestPair.pairAddress ?? "",
        dexId: bestPair.dexId ?? "",
      } satisfies TokenPrice;
    } catch (error) {
      console.error(`Failed to fetch price for chain ${chainId}:`, error);
      return null;
    }
  });

  const results = await Promise.allSettled(fetchPromises);

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      prices.push(result.value);
    }
  }

  return prices;
}

// Cache for server-side price fetching
let priceCache: TokenPrice[] | null = null;
let priceCacheTimestamp = 0;
const PRICE_CACHE_TTL = 60_000; // 1 minute

export async function getCachedXenPrices(): Promise<TokenPrice[]> {
  const now = Date.now();
  if (priceCache && now - priceCacheTimestamp < PRICE_CACHE_TTL) {
    return priceCache;
  }

  const prices = await fetchXenPrices();
  priceCache = prices;
  priceCacheTimestamp = now;
  return prices;
}
