"use client";

import { useQuery } from "@tanstack/react-query";

// Serialized version of XenGlobalData (bigints become strings via JSON)
export interface XenChainDataSerialized {
  chainId: number;
  chainName: string;
  slug: string;
  color: string;
  contractAddress: string;
  globalRank: string;
  activeMinters: string;
  activeStakes: string;
  totalSupply: string;
  totalXenStaked: string;
  currentAMP: string;
  currentAPY: string;
  currentEAAR: string;
  currentMaxTerm: string;
  genesisTs: string;
}

export function useXenGlobalData() {
  return useQuery<XenChainDataSerialized[]>({
    queryKey: ["xen-global-data"],
    queryFn: async () => {
      const res = await fetch("/api/xen/global");
      if (!res.ok) throw new Error("Failed to fetch XEN global data");
      return res.json();
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: 3,
  });
}

export function useXenChainData(chainSlug: string) {
  return useQuery<XenChainDataSerialized>({
    queryKey: ["xen-chain-data", chainSlug],
    queryFn: async () => {
      const res = await fetch(`/api/xen/chain/${chainSlug}`);
      if (!res.ok) throw new Error(`Failed to fetch data for ${chainSlug}`);
      return res.json();
    },
    staleTime: 10_000,
    refetchInterval: 20_000,
    retry: 3,
  });
}
