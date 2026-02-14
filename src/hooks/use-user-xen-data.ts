"use client";

import { useReadContract } from "wagmi";
import { xenCryptoAbi } from "@/abi/xen-crypto";
import { getChainConfigById } from "@/config/chains";

export function useUserMint(chainId: number, address?: `0x${string}`) {
  const config = getChainConfigById(chainId);

  return useReadContract({
    address: config?.contractAddress,
    abi: xenCryptoAbi,
    functionName: "getUserMint",
    chainId,
    account: address,
    query: {
      enabled: !!address && !!config,
      staleTime: 10_000,
      refetchInterval: 20_000,
    },
  });
}

export function useUserStake(chainId: number, address?: `0x${string}`) {
  const config = getChainConfigById(chainId);

  return useReadContract({
    address: config?.contractAddress,
    abi: xenCryptoAbi,
    functionName: "getUserStake",
    chainId,
    account: address,
    query: {
      enabled: !!address && !!config,
      staleTime: 10_000,
      refetchInterval: 20_000,
    },
  });
}

export function useUserBalance(chainId: number, address?: `0x${string}`) {
  const config = getChainConfigById(chainId);

  return useReadContract({
    address: config?.contractAddress,
    abi: xenCryptoAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId,
    query: {
      enabled: !!address && !!config,
      staleTime: 10_000,
      refetchInterval: 20_000,
    },
  });
}

export function useGlobalRank(chainId: number) {
  const config = getChainConfigById(chainId);

  return useReadContract({
    address: config?.contractAddress,
    abi: xenCryptoAbi,
    functionName: "globalRank",
    chainId,
    query: {
      enabled: !!config,
      staleTime: 10_000,
      refetchInterval: 15_000,
    },
  });
}
