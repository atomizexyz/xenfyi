import { describe, it, expect } from "vitest";
import { cn, formatNumber, shortenAddress, formatEther } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", false && "hidden", true && "visible")).toBe(
      "base visible"
    );
  });

  it("should merge tailwind classes correctly", () => {
    expect(cn("px-4 py-2", "px-6")).toBe("py-2 px-6");
  });
});

describe("formatNumber", () => {
  it("should format small numbers normally", () => {
    expect(formatNumber(12345)).toBe("12,345");
  });

  it("should format large numbers in compact notation", () => {
    const result = formatNumber(5_000_000);
    expect(result).toMatch(/5M/);
  });

  it("should handle bigint with decimals", () => {
    const result = formatNumber(1000000000000000000n, 18);
    expect(result).toBe("1");
  });
});

describe("shortenAddress", () => {
  it("should shorten address with default chars", () => {
    const addr = "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8";
    expect(shortenAddress(addr)).toBe("0x0645...6Fb8");
  });

  it("should shorten address with custom chars", () => {
    const addr = "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8";
    expect(shortenAddress(addr, 6)).toBe("0x06450d...9a6Fb8");
  });
});

describe("formatEther", () => {
  it("should format zero", () => {
    expect(formatEther(0n)).toBe("0");
  });

  it("should format 1 ether", () => {
    expect(formatEther(1000000000000000000n)).toBe("1");
  });

  it("should format small amounts", () => {
    expect(formatEther(100000000000n)).toBe("< 0.001");
  });
});
