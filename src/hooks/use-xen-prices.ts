"use client";

import { useQuery } from "@tanstack/react-query";
import type { TokenPrice } from "@/lib/dexscreener";

export function useXenPrices() {
  return useQuery<TokenPrice[]>({
    queryKey: ["xen-prices"],
    queryFn: async () => {
      const res = await fetch("/api/xen/prices");
      if (!res.ok) throw new Error("Failed to fetch prices");
      return res.json();
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}

export function useXenPrice(chainSlug: string) {
  const { data: prices } = useXenPrices();
  return prices?.find((p) => p.chainSlug === chainSlug);
}
