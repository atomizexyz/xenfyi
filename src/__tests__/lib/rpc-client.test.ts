import { describe, it, expect, vi } from "vitest";

// Mock viem
vi.mock("viem", async (importOriginal) => {
  const actual = await importOriginal<typeof import("viem")>();
  return {
    ...actual,
    createPublicClient: vi.fn(() => ({
      readContract: vi.fn(),
      multicall: vi.fn(),
    })),
    http: vi.fn(() => "http-transport"),
    webSocket: vi.fn(() => "ws-transport"),
    fallback: vi.fn((...args: unknown[]) => args),
  };
});

describe("RPC Client", () => {
  it("should create a public client for a valid chain", async () => {
    const { getPublicClient } = await import("@/lib/rpc-client");
    const client = getPublicClient(1); // Ethereum mainnet
    expect(client).toBeDefined();
    expect(client.readContract).toBeDefined();
    expect(client.multicall).toBeDefined();
  });

  it("should cache clients for the same chain", async () => {
    const { getPublicClient } = await import("@/lib/rpc-client");
    const client1 = getPublicClient(1);
    const client2 = getPublicClient(1);
    expect(client1).toBe(client2); // Same reference
  });

  it("should throw for unknown chain ID", async () => {
    const { getPublicClient } = await import("@/lib/rpc-client");
    expect(() => getPublicClient(99999)).toThrow("No chain config for chainId 99999");
  });

  it("should create clients for all chains", async () => {
    const { getAllPublicClients } = await import("@/lib/rpc-client");
    const clients = getAllPublicClients();
    expect(clients.size).toBe(13);
  });
});
