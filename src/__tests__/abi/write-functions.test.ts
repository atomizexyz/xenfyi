import { describe, it, expect } from "vitest";
import { xenCryptoAbi } from "@/abi/xen-crypto";

describe("XEN Crypto ABI - Write Functions", () => {
  const writeFunctions = xenCryptoAbi.filter(
    (item) => item.type === "function" && item.stateMutability === "nonpayable"
  );

  it("should have claimRank with term parameter", () => {
    const fn = writeFunctions.find((f) => f.name === "claimRank");
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(1);
    expect(fn!.inputs[0].name).toBe("term");
    expect(fn!.inputs[0].type).toBe("uint256");
  });

  it("should have claimMintReward with no parameters", () => {
    const fn = writeFunctions.find((f) => f.name === "claimMintReward");
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(0);
  });

  it("should have claimMintRewardAndStake with pct and term", () => {
    const fn = writeFunctions.find(
      (f) => f.name === "claimMintRewardAndStake"
    );
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(2);
    expect(fn!.inputs[0].name).toBe("pct");
    expect(fn!.inputs[0].type).toBe("uint256");
    expect(fn!.inputs[1].name).toBe("term");
    expect(fn!.inputs[1].type).toBe("uint256");
  });

  it("should have claimMintRewardAndShare with other and pct", () => {
    const fn = writeFunctions.find(
      (f) => f.name === "claimMintRewardAndShare"
    );
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(2);
    expect(fn!.inputs[0].name).toBe("other");
    expect(fn!.inputs[0].type).toBe("address");
    expect(fn!.inputs[1].name).toBe("pct");
    expect(fn!.inputs[1].type).toBe("uint256");
  });

  it("should have stake with amount and term", () => {
    const fn = writeFunctions.find((f) => f.name === "stake");
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(2);
    expect(fn!.inputs[0].name).toBe("amount");
    expect(fn!.inputs[0].type).toBe("uint256");
    expect(fn!.inputs[1].name).toBe("term");
    expect(fn!.inputs[1].type).toBe("uint256");
  });

  it("should have withdraw with no parameters", () => {
    const fn = writeFunctions.find((f) => f.name === "withdraw");
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(0);
  });

  it("should have burn with user and amount", () => {
    const fn = writeFunctions.find((f) => f.name === "burn");
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(2);
    expect(fn!.inputs[0].name).toBe("user");
    expect(fn!.inputs[0].type).toBe("address");
    expect(fn!.inputs[1].name).toBe("amount");
    expect(fn!.inputs[1].type).toBe("uint256");
  });

  it("should have approve for ERC20 compatibility", () => {
    const fn = writeFunctions.find((f) => f.name === "approve");
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(2);
    expect(fn!.inputs[0].name).toBe("spender");
    expect(fn!.inputs[1].name).toBe("amount");
  });

  it("should have transfer and transferFrom", () => {
    const transfer = writeFunctions.find((f) => f.name === "transfer");
    expect(transfer).toBeDefined();
    expect(transfer!.inputs).toHaveLength(2);

    const transferFrom = writeFunctions.find(
      (f) => f.name === "transferFrom"
    );
    expect(transferFrom).toBeDefined();
    expect(transferFrom!.inputs).toHaveLength(3);
  });
});

describe("XEN Crypto ABI - Events", () => {
  const events = xenCryptoAbi.filter((item) => item.type === "event");

  it("should have RankClaimed event", () => {
    const event = events.find((e) => e.name === "RankClaimed");
    expect(event).toBeDefined();
    expect(event!.inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("should have MintClaimed event", () => {
    const event = events.find((e) => e.name === "MintClaimed");
    expect(event).toBeDefined();
    expect(event!.inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("should have Staked event", () => {
    const event = events.find((e) => e.name === "Staked");
    expect(event).toBeDefined();
    expect(event!.inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("should have Withdrawn event", () => {
    const event = events.find((e) => e.name === "Withdrawn");
    expect(event).toBeDefined();
    expect(event!.inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("should have Transfer event (ERC20)", () => {
    const event = events.find((e) => e.name === "Transfer");
    expect(event).toBeDefined();
    expect(event!.inputs).toHaveLength(3);
  });

  it("should have Approval event (ERC20)", () => {
    const event = events.find((e) => e.name === "Approval");
    expect(event).toBeDefined();
    expect(event!.inputs).toHaveLength(3);
  });
});

describe("XEN Crypto ABI - View Functions", () => {
  const viewFunctions = xenCryptoAbi.filter(
    (item) =>
      item.type === "function" && item.stateMutability === "view"
  );

  it("should have getUserMint returning MintInfo struct", () => {
    const fn = viewFunctions.find((f) => f.name === "getUserMint");
    expect(fn).toBeDefined();
    expect(fn!.outputs.length).toBeGreaterThanOrEqual(1);
  });

  it("should have getUserStake returning StakeInfo struct", () => {
    const fn = viewFunctions.find((f) => f.name === "getUserStake");
    expect(fn).toBeDefined();
    expect(fn!.outputs.length).toBeGreaterThanOrEqual(1);
  });

  it("should have balanceOf for ERC20 compatibility", () => {
    const fn = viewFunctions.find((f) => f.name === "balanceOf");
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(1);
    expect(fn!.inputs[0].type).toBe("address");
    expect(fn!.outputs).toHaveLength(1);
  });

  it("should have allowance for ERC20 compatibility", () => {
    const fn = viewFunctions.find((f) => f.name === "allowance");
    expect(fn).toBeDefined();
    expect(fn!.inputs).toHaveLength(2);
  });

  it("should have all global state view functions", () => {
    const required = [
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

    for (const name of required) {
      const fn = viewFunctions.find((f) => f.name === name);
      expect(fn, `Expected view function ${name} to exist`).toBeDefined();
    }
  });
});
