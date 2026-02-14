import { describe, it, expect } from "vitest";
import { xenCryptoAbi } from "@/abi/xen-crypto";

describe("XEN Crypto ABI", () => {
  it("should be a valid ABI array", () => {
    expect(Array.isArray(xenCryptoAbi)).toBe(true);
    expect(xenCryptoAbi.length).toBeGreaterThan(0);
  });

  it("should contain claimRank function", () => {
    const claimRank = xenCryptoAbi.find(
      (item) => item.type === "function" && item.name === "claimRank"
    );
    expect(claimRank).toBeDefined();
    expect(claimRank?.inputs).toHaveLength(1);
    expect(claimRank?.inputs?.[0]?.name).toBe("term");
  });

  it("should contain stake function", () => {
    const stake = xenCryptoAbi.find(
      (item) => item.type === "function" && item.name === "stake"
    );
    expect(stake).toBeDefined();
    expect(stake?.inputs).toHaveLength(2);
  });

  it("should contain claimMintReward function", () => {
    const claimMint = xenCryptoAbi.find(
      (item) => item.type === "function" && item.name === "claimMintReward"
    );
    expect(claimMint).toBeDefined();
    expect(claimMint?.inputs).toHaveLength(0);
  });

  it("should contain withdraw function", () => {
    const withdraw = xenCryptoAbi.find(
      (item) => item.type === "function" && item.name === "withdraw"
    );
    expect(withdraw).toBeDefined();
  });

  it("should contain globalRank view function", () => {
    const globalRank = xenCryptoAbi.find(
      (item) => item.type === "function" && item.name === "globalRank"
    );
    expect(globalRank).toBeDefined();
    expect(globalRank?.stateMutability).toBe("view");
  });

  it("should contain getUserMint view function", () => {
    const getUserMint = xenCryptoAbi.find(
      (item) => item.type === "function" && item.name === "getUserMint"
    );
    expect(getUserMint).toBeDefined();
    expect(getUserMint?.stateMutability).toBe("view");
  });

  it("should contain getUserStake view function", () => {
    const getUserStake = xenCryptoAbi.find(
      (item) => item.type === "function" && item.name === "getUserStake"
    );
    expect(getUserStake).toBeDefined();
    expect(getUserStake?.stateMutability).toBe("view");
  });

  it("should contain RankClaimed event", () => {
    const event = xenCryptoAbi.find(
      (item) => item.type === "event" && item.name === "RankClaimed"
    );
    expect(event).toBeDefined();
  });

  it("should contain Staked event", () => {
    const event = xenCryptoAbi.find(
      (item) => item.type === "event" && item.name === "Staked"
    );
    expect(event).toBeDefined();
  });

  it("should contain MintClaimed event", () => {
    const event = xenCryptoAbi.find(
      (item) => item.type === "event" && item.name === "MintClaimed"
    );
    expect(event).toBeDefined();
  });

  it("should contain all required view functions for global data", () => {
    const requiredFunctions = [
      "globalRank",
      "activeMinters",
      "activeStakes",
      "totalSupply",
      "totalXenStaked",
      "getCurrentAMP",
      "getCurrentAPY",
      "getCurrentEAAR",
      "getCurrentMaxTerm",
      "genesisTs",
    ];

    for (const fn of requiredFunctions) {
      const found = xenCryptoAbi.find(
        (item) => item.type === "function" && item.name === fn
      );
      expect(found, `Missing function: ${fn}`).toBeDefined();
      expect(found?.stateMutability).toBe("view");
    }
  });
});
