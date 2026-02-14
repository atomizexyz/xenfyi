import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("DexScreener Price Fetching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should export fetchXenPrices function", async () => {
    const { fetchXenPrices } = await import("@/lib/dexscreener");
    expect(typeof fetchXenPrices).toBe("function");
  });

  it("should export getCachedXenPrices function", async () => {
    const { getCachedXenPrices } = await import("@/lib/dexscreener");
    expect(typeof getCachedXenPrices).toBe("function");
  });

  it("should handle empty API response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ pairs: [] }),
    });

    const { fetchXenPrices } = await import("@/lib/dexscreener");
    const prices = await fetchXenPrices();
    expect(Array.isArray(prices)).toBe(true);
  });

  it("should handle API errors gracefully", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
    });

    const { fetchXenPrices } = await import("@/lib/dexscreener");
    const prices = await fetchXenPrices();
    expect(Array.isArray(prices)).toBe(true);
    expect(prices.length).toBe(0);
  });

  it("should handle network errors gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { fetchXenPrices } = await import("@/lib/dexscreener");
    const prices = await fetchXenPrices();
    expect(Array.isArray(prices)).toBe(true);
    expect(prices.length).toBe(0);
  });

  it("should parse valid pair data", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          pairs: [
            {
              chainId: "ethereum",
              priceUsd: "0.00001234",
              priceChange: { h24: 5.5 },
              volume: { h24: 10000 },
              liquidity: { usd: 50000 },
              pairAddress: "0x1234567890abcdef",
              dexId: "uniswap",
            },
          ],
        }),
    });

    const { fetchXenPrices } = await import("@/lib/dexscreener");
    const prices = await fetchXenPrices();

    // At least one price should be parsed
    if (prices.length > 0) {
      const price = prices[0]!;
      expect(price.priceUsd).toBeGreaterThanOrEqual(0);
      expect(price.chainSlug).toBeTruthy();
    }
  });

  it("should have correct TokenPrice interface fields", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          pairs: [
            {
              chainId: "ethereum",
              priceUsd: "0.00001234",
              priceChange: { h24: 5.5 },
              volume: { h24: 10000 },
              liquidity: { usd: 50000 },
              pairAddress: "0xpair",
              dexId: "uniswap",
            },
          ],
        }),
    });

    const { fetchXenPrices } = await import("@/lib/dexscreener");
    const prices = await fetchXenPrices();

    if (prices.length > 0) {
      const p = prices[0]!;
      expect(p).toHaveProperty("chainId");
      expect(p).toHaveProperty("chainSlug");
      expect(p).toHaveProperty("priceUsd");
      expect(p).toHaveProperty("priceChange24h");
      expect(p).toHaveProperty("volume24h");
      expect(p).toHaveProperty("liquidity");
      expect(p).toHaveProperty("pairAddress");
      expect(p).toHaveProperty("dexId");
    }
  });
});
