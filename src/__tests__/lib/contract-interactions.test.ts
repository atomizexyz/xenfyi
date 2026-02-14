import { describe, it, expect, vi, beforeEach } from "vitest";

const mockMulticall = vi.fn();
const mockReadContract = vi.fn();

vi.mock("@/lib/rpc-client", () => ({
  getPublicClient: vi.fn(() => ({
    multicall: mockMulticall,
    readContract: mockReadContract,
  })),
}));

describe("Contract Interactions - User Mint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should fetch user mint info with active position", async () => {
    const maturityTs = BigInt(Math.floor(Date.now() / 1000) + 86400 * 7);
    mockReadContract.mockResolvedValueOnce({
      user: "0x1234567890abcdef1234567890abcdef12345678",
      term: 30n,
      maturityTs,
      rank: 500000n,
      amplifier: 100n,
      eaaRate: 50n,
    });

    const { fetchUserMintInfo } = await import("@/lib/xen-reader");
    const result = await fetchUserMintInfo(
      1,
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(result).not.toBeNull();
    expect(result!.rank).toBe(500000n);
    expect(result!.term).toBe(30n);
    expect(result!.maturityTs).toBe(maturityTs);
    expect(result!.amplifier).toBe(100n);
    expect(result!.eaaRate).toBe(50n);
  });

  it("should return null for user with no mint", async () => {
    mockReadContract.mockRejectedValueOnce(new Error("No mint found"));

    const { fetchUserMintInfo } = await import("@/lib/xen-reader");
    const result = await fetchUserMintInfo(
      1,
      "0x0000000000000000000000000000000000000001"
    );

    expect(result).toBeNull();
  });

  it("should return null for invalid chain ID", async () => {
    const { fetchUserMintInfo } = await import("@/lib/xen-reader");
    const result = await fetchUserMintInfo(
      99999,
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(result).toBeNull();
    expect(mockReadContract).not.toHaveBeenCalled();
  });

  it("should correctly identify mature mint position", async () => {
    const pastMaturity = BigInt(Math.floor(Date.now() / 1000) - 3600);
    mockReadContract.mockResolvedValueOnce({
      user: "0x1234567890abcdef1234567890abcdef12345678",
      term: 1n,
      maturityTs: pastMaturity,
      rank: 100n,
      amplifier: 50n,
      eaaRate: 25n,
    });

    const { fetchUserMintInfo } = await import("@/lib/xen-reader");
    const result = await fetchUserMintInfo(
      1,
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(result).not.toBeNull();
    const isMature = Number(result!.maturityTs) * 1000 <= Date.now();
    expect(isMature).toBe(true);
  });
});

describe("Contract Interactions - User Stake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should fetch user stake info with active position", async () => {
    const maturityTs = BigInt(Math.floor(Date.now() / 1000) + 86400 * 90);
    mockReadContract.mockResolvedValueOnce({
      term: 90n,
      maturityTs,
      amount: 1000000000000000000000n, // 1000 XEN
      apy: 20n,
    });

    const { fetchUserStakeInfo } = await import("@/lib/xen-reader");
    const result = await fetchUserStakeInfo(
      1,
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(result).not.toBeNull();
    expect(result!.term).toBe(90n);
    expect(result!.amount).toBe(1000000000000000000000n);
    expect(result!.apy).toBe(20n);
    expect(Number(result!.amount) / 1e18).toBe(1000);
  });

  it("should return null for user with no stake", async () => {
    mockReadContract.mockRejectedValueOnce(new Error("No stake found"));

    const { fetchUserStakeInfo } = await import("@/lib/xen-reader");
    const result = await fetchUserStakeInfo(
      1,
      "0x0000000000000000000000000000000000000001"
    );

    expect(result).toBeNull();
  });

  it("should correctly identify mature stake", async () => {
    const pastMaturity = BigInt(Math.floor(Date.now() / 1000) - 7200);
    mockReadContract.mockResolvedValueOnce({
      term: 30n,
      maturityTs: pastMaturity,
      amount: 500000000000000000000n,
      apy: 15n,
    });

    const { fetchUserStakeInfo } = await import("@/lib/xen-reader");
    const result = await fetchUserStakeInfo(
      137,
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(result).not.toBeNull();
    const isMature = Number(result!.maturityTs) * 1000 <= Date.now();
    expect(isMature).toBe(true);
  });
});

describe("Contract Interactions - Balance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should fetch user XEN balance", async () => {
    mockReadContract.mockResolvedValueOnce(5000000000000000000000n); // 5000 XEN

    const { fetchUserBalance } = await import("@/lib/xen-reader");
    const balance = await fetchUserBalance(
      1,
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(balance).toBe(5000000000000000000000n);
    expect(Number(balance) / 1e18).toBe(5000);
  });

  it("should return 0 for unknown chain", async () => {
    const { fetchUserBalance } = await import("@/lib/xen-reader");
    const balance = await fetchUserBalance(
      99999,
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(balance).toBe(0n);
  });

  it("should return 0 on error", async () => {
    mockReadContract.mockRejectedValueOnce(new Error("RPC error"));

    const { fetchUserBalance } = await import("@/lib/xen-reader");
    const balance = await fetchUserBalance(
      1,
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(balance).toBe(0n);
  });
});

describe("Contract Interactions - Global Data Multicall", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should handle partial multicall failures gracefully", async () => {
    mockMulticall.mockResolvedValueOnce([
      { status: "success", result: 2000000n },
      { status: "failure", error: new Error("timeout") },
      { status: "success", result: 300n },
      { status: "success", result: 5000000000000000000000n },
      { status: "success", result: 1000000000000000000000n },
      { status: "failure", error: new Error("timeout") },
      { status: "success", result: 20n },
      { status: "success", result: 100n },
      { status: "success", result: 864000n },
      { status: "success", result: 1665331200n },
    ]);

    const { fetchChainGlobalData } = await import("@/lib/xen-reader");
    const { chainConfigs } = await import("@/config/chains");

    const ethConfig = chainConfigs.find((c) => c.slug === "ethereum")!;
    const data = await fetchChainGlobalData(ethConfig);

    expect(data).not.toBeNull();
    // Failed calls should default to 0n
    expect(data!.activeMinters).toBe(0n);
    expect(data!.currentAMP).toBe(0n);
    // Successful calls should have values
    expect(data!.globalRank).toBe(2000000n);
    expect(data!.activeStakes).toBe(300n);
  });

  it("should handle complete multicall failure", async () => {
    mockMulticall.mockRejectedValueOnce(new Error("Network error"));

    const { fetchChainGlobalData } = await import("@/lib/xen-reader");
    const { chainConfigs } = await import("@/config/chains");

    const ethConfig = chainConfigs.find((c) => c.slug === "ethereum")!;
    const data = await fetchChainGlobalData(ethConfig);

    expect(data).toBeNull();
  });

  it("should fetch data for all supported chains", async () => {
    // Set up mock to return data for all 13 chains
    for (let i = 0; i < 13; i++) {
      mockMulticall.mockResolvedValueOnce([
        { status: "success", result: BigInt(1000000 + i) },
        { status: "success", result: BigInt(500 + i) },
        { status: "success", result: BigInt(200 + i) },
        { status: "success", result: BigInt(1e18) * BigInt(1000 + i) },
        { status: "success", result: BigInt(1e18) * BigInt(500 + i) },
        { status: "success", result: BigInt(100 + i) },
        { status: "success", result: BigInt(20 + i) },
        { status: "success", result: BigInt(100 + i) },
        { status: "success", result: BigInt(864000 + i) },
        { status: "success", result: 1665331200n },
      ]);
    }

    const { fetchAllChainsGlobalData } = await import("@/lib/xen-reader");
    const data = await fetchAllChainsGlobalData();

    expect(data.length).toBe(13);
    // Verify each chain has unique data
    const ranks = data.map((d) => d.globalRank);
    const uniqueRanks = new Set(ranks);
    expect(uniqueRanks.size).toBe(13);
  });
});

describe("Contract Interactions - Cross-chain consistency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should preserve chain metadata alongside contract data", async () => {
    mockMulticall.mockResolvedValueOnce([
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
    ]);

    const { fetchChainGlobalData } = await import("@/lib/xen-reader");
    const { chainConfigs } = await import("@/config/chains");

    const baseConfig = chainConfigs.find((c) => c.slug === "base")!;
    const data = await fetchChainGlobalData(baseConfig);

    expect(data).not.toBeNull();
    expect(data!.chainId).toBe(8453);
    expect(data!.chainName).toBe("Base");
    expect(data!.slug).toBe("base");
    expect(data!.contractAddress).toBe("0xffcbF84650cE02DaFE96926B37a0ac5E34932fa5");
    expect(data!.color).toBeTruthy();
  });

  it("should handle different contract addresses per chain", async () => {
    const { chainConfigs } = await import("@/config/chains");

    const ethConfig = chainConfigs.find((c) => c.slug === "ethereum")!;
    const polyConfig = chainConfigs.find((c) => c.slug === "polygon")!;
    const baseConfig = chainConfigs.find((c) => c.slug === "base")!;

    // Ethereum has a different contract address from Polygon
    expect(ethConfig.contractAddress).toBe("0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8");
    // Polygon and BSC share the same address
    expect(polyConfig.contractAddress).toBe("0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e");
    // Base has its own
    expect(baseConfig.contractAddress).toBe("0xffcbF84650cE02DaFE96926B37a0ac5E34932fa5");
  });
});
