import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the rpc-client module
vi.mock("@/lib/rpc-client", () => ({
  getPublicClient: vi.fn(() => ({
    multicall: vi.fn(() =>
      Promise.resolve([
        { status: "success", result: 1000000n },
        { status: "success", result: 500n },
        { status: "success", result: 200n },
        { status: "success", result: 1000000000000000000000n },
        { status: "success", result: 500000000000000000000n },
        { status: "success", result: 100n },
        { status: "success", result: 20n },
        { status: "success", result: 100n },
        { status: "success", result: 864000n },
        { status: "success", result: 1665331200n },
      ])
    ),
    readContract: vi.fn(() => Promise.resolve(0n)),
  })),
}));

describe("XEN Reader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch chain global data successfully", async () => {
    const { fetchChainGlobalData } = await import("@/lib/xen-reader");
    const { chainConfigs } = await import("@/config/chains");

    const ethConfig = chainConfigs.find((c) => c.slug === "ethereum");
    expect(ethConfig).toBeDefined();

    const data = await fetchChainGlobalData(ethConfig!);
    expect(data).not.toBeNull();
    expect(data!.chainName).toBe("Ethereum");
    expect(data!.globalRank).toBe(1000000n);
    expect(data!.activeMinters).toBe(500n);
    expect(data!.activeStakes).toBe(200n);
    expect(data!.totalSupply).toBe(1000000000000000000000n);
  });

  it("should fetch all chains global data", async () => {
    const { fetchAllChainsGlobalData } = await import("@/lib/xen-reader");
    const data = await fetchAllChainsGlobalData();
    expect(data.length).toBe(13);
  });

  it("should return correct chain properties", async () => {
    const { fetchChainGlobalData } = await import("@/lib/xen-reader");
    const { chainConfigs } = await import("@/config/chains");

    const bscConfig = chainConfigs.find((c) => c.slug === "bsc");
    const data = await fetchChainGlobalData(bscConfig!);

    expect(data).not.toBeNull();
    expect(data!.slug).toBe("bsc");
    expect(data!.contractAddress).toBe(
      "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e"
    );
  });

  it("should return data with correct structure", async () => {
    const { fetchChainGlobalData } = await import("@/lib/xen-reader");
    const { chainConfigs } = await import("@/config/chains");

    const ethConfig = chainConfigs.find((c) => c.slug === "ethereum");
    const data = await fetchChainGlobalData(ethConfig!);

    expect(data).not.toBeNull();
    // Verify all fields exist
    expect(data).toHaveProperty("chainId");
    expect(data).toHaveProperty("chainName");
    expect(data).toHaveProperty("slug");
    expect(data).toHaveProperty("color");
    expect(data).toHaveProperty("contractAddress");
    expect(data).toHaveProperty("globalRank");
    expect(data).toHaveProperty("activeMinters");
    expect(data).toHaveProperty("activeStakes");
    expect(data).toHaveProperty("totalSupply");
    expect(data).toHaveProperty("totalXenStaked");
    expect(data).toHaveProperty("currentAMP");
    expect(data).toHaveProperty("currentAPY");
    expect(data).toHaveProperty("currentEAAR");
    expect(data).toHaveProperty("currentMaxTerm");
    expect(data).toHaveProperty("genesisTs");
  });
});
