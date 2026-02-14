import { describe, it, expect } from "vitest";

describe("useXenPrices hook", () => {
  it("should export useXenPrices", async () => {
    const mod = await import("@/hooks/use-xen-prices");
    expect(mod.useXenPrices).toBeDefined();
    expect(typeof mod.useXenPrices).toBe("function");
  });

  it("should export useXenPrice", async () => {
    const mod = await import("@/hooks/use-xen-prices");
    expect(mod.useXenPrice).toBeDefined();
    expect(typeof mod.useXenPrice).toBe("function");
  });
});

describe("useXenGlobalData hook", () => {
  it("should export useXenGlobalData", async () => {
    const mod = await import("@/hooks/use-xen-global-data");
    expect(mod.useXenGlobalData).toBeDefined();
    expect(typeof mod.useXenGlobalData).toBe("function");
  });

  it("should export useXenChainData", async () => {
    const mod = await import("@/hooks/use-xen-global-data");
    expect(mod.useXenChainData).toBeDefined();
    expect(typeof mod.useXenChainData).toBe("function");
  });
});

describe("useUserXenData hooks", () => {
  it("should export useUserMint", async () => {
    const mod = await import("@/hooks/use-user-xen-data");
    expect(mod.useUserMint).toBeDefined();
    expect(typeof mod.useUserMint).toBe("function");
  });

  it("should export useUserStake", async () => {
    const mod = await import("@/hooks/use-user-xen-data");
    expect(mod.useUserStake).toBeDefined();
    expect(typeof mod.useUserStake).toBe("function");
  });

  it("should export useUserBalance", async () => {
    const mod = await import("@/hooks/use-user-xen-data");
    expect(mod.useUserBalance).toBeDefined();
    expect(typeof mod.useUserBalance).toBe("function");
  });

  it("should export useGlobalRank", async () => {
    const mod = await import("@/hooks/use-user-xen-data");
    expect(mod.useGlobalRank).toBeDefined();
    expect(typeof mod.useGlobalRank).toBe("function");
  });
});
