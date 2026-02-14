import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: bigint | number, decimals = 0): string {
  const num = typeof value === "bigint" ? Number(value) / 10 ** decimals : value;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    notation: num > 1_000_000 ? "compact" : "standard",
  }).format(num);
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatEther(wei: bigint): string {
  const eth = Number(wei) / 1e18;
  if (eth === 0) return "0";
  if (eth < 0.001) return "< 0.001";
  return eth.toLocaleString("en-US", { maximumFractionDigits: 4 });
}
