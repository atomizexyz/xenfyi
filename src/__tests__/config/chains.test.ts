import { describe, it, expect } from "vitest";
import {
  chainConfigs,
  xenContracts,
  getChainConfig,
  getChainConfigById,
} from "@/config/chains";

describe("Chain Configurations", () => {
  it("should have 13 chain configurations", () => {
    expect(chainConfigs).toHaveLength(13);
  });

  it("should have unique slugs for each chain", () => {
    const slugs = chainConfigs.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("should have unique chain IDs", () => {
    const ids = chainConfigs.map((c) => c.chain.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have valid contract addresses for each chain", () => {
    for (const config of chainConfigs) {
      expect(config.contractAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    }
  });

  it("should have at least one RPC URL per chain", () => {
    for (const config of chainConfigs) {
      expect(config.rpcUrls.length).toBeGreaterThan(0);
    }
  });

  it("should match xenContracts to chainConfigs", () => {
    for (const config of chainConfigs) {
      expect(xenContracts[config.chain.id]).toBe(config.contractAddress);
    }
  });

  it("should find chain by slug", () => {
    const eth = getChainConfig("ethereum");
    expect(eth).toBeDefined();
    expect(eth?.chain.id).toBe(1);
  });

  it("should find chain by ID", () => {
    const polygon = getChainConfigById(137);
    expect(polygon).toBeDefined();
    expect(polygon?.slug).toBe("polygon");
  });

  it("should return undefined for unknown slug", () => {
    expect(getChainConfig("unknown")).toBeUndefined();
  });

  it("should return undefined for unknown chain ID", () => {
    expect(getChainConfigById(99999)).toBeUndefined();
  });

  it("should include all required chains", () => {
    const requiredChains = [
      "ethereum",
      "polygon",
      "bsc",
      "avalanche",
      "moonbeam",
      "evmos",
      "fantom",
      "dogechain",
      "okc",
      "ethpow",
      "base",
      "pulsechain",
      "optimism",
    ];
    const slugs = chainConfigs.map((c) => c.slug);
    for (const chain of requiredChains) {
      expect(slugs).toContain(chain);
    }
  });

  it("should have Ethereum mainnet contract address 0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8", () => {
    const eth = getChainConfig("ethereum");
    expect(eth?.contractAddress).toBe(
      "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8"
    );
  });

  it("should have Multicall3 contract configured on all chains", () => {
    for (const config of chainConfigs) {
      const contracts = config.chain.contracts;
      expect(
        contracts?.multicall3,
        `${config.chain.name} (${config.chain.id}) is missing multicall3 contract`
      ).toBeDefined();
      expect(contracts?.multicall3?.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    }
  });
});
