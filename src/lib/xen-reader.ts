import { xenCryptoAbi } from "@/abi/xen-crypto";
import { chainConfigs, type ChainConfig } from "@/config/chains";
import { getPublicClient } from "@/lib/rpc-client";

export interface XenGlobalData {
  chainId: number;
  chainName: string;
  slug: string;
  color: string;
  contractAddress: `0x${string}`;
  globalRank: bigint;
  activeMinters: bigint;
  activeStakes: bigint;
  totalSupply: bigint;
  totalXenStaked: bigint;
  currentAMP: bigint;
  currentAPY: bigint;
  currentEAAR: bigint;
  currentMaxTerm: bigint;
  genesisTs: bigint;
}

export interface UserMintInfo {
  user: `0x${string}`;
  term: bigint;
  maturityTs: bigint;
  rank: bigint;
  amplifier: bigint;
  eaaRate: bigint;
}

export interface UserStakeInfo {
  term: bigint;
  maturityTs: bigint;
  amount: bigint;
  apy: bigint;
}

const globalReadFunctions = [
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
] as const;

export async function fetchChainGlobalData(
  config: ChainConfig
): Promise<XenGlobalData | null> {
  try {
    const client = getPublicClient(config.chain.id);
    const contractConfig = {
      address: config.contractAddress,
      abi: xenCryptoAbi,
    } as const;

    const results = await client.multicall({
      contracts: globalReadFunctions.map((fn) => ({
        ...contractConfig,
        functionName: fn,
      })),
      allowFailure: true,
    });

    const values = results.map((r) =>
      r.status === "success" ? (r.result as bigint) : 0n
    );

    return {
      chainId: config.chain.id,
      chainName: config.chain.name,
      slug: config.slug,
      color: config.color,
      contractAddress: config.contractAddress,
      globalRank: values[0]!,
      activeMinters: values[1]!,
      activeStakes: values[2]!,
      totalSupply: values[3]!,
      totalXenStaked: values[4]!,
      currentAMP: values[5]!,
      currentAPY: values[6]!,
      currentEAAR: values[7]!,
      currentMaxTerm: values[8]!,
      genesisTs: values[9]!,
    };
  } catch (error) {
    console.error(`Failed to fetch data for ${config.chain.name}:`, error);
    return null;
  }
}

export async function fetchAllChainsGlobalData(): Promise<XenGlobalData[]> {
  const results = await Promise.allSettled(
    chainConfigs.map((config) => fetchChainGlobalData(config))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<XenGlobalData | null> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value)
    .filter((v): v is XenGlobalData => v !== null);
}

export async function fetchUserMintInfo(
  chainId: number,
  address: `0x${string}`
): Promise<UserMintInfo | null> {
  try {
    const config = chainConfigs.find((c) => c.chain.id === chainId);
    if (!config) return null;

    const client = getPublicClient(chainId);
    const result = await client.readContract({
      address: config.contractAddress,
      abi: xenCryptoAbi,
      functionName: "getUserMint",
      account: address,
    });

    const r = result as unknown as {
      user: `0x${string}`;
      term: bigint;
      maturityTs: bigint;
      rank: bigint;
      amplifier: bigint;
      eaaRate: bigint;
    };

    return { user: r.user, term: r.term, maturityTs: r.maturityTs, rank: r.rank, amplifier: r.amplifier, eaaRate: r.eaaRate };
  } catch {
    return null;
  }
}

export async function fetchUserStakeInfo(
  chainId: number,
  address: `0x${string}`
): Promise<UserStakeInfo | null> {
  try {
    const config = chainConfigs.find((c) => c.chain.id === chainId);
    if (!config) return null;

    const client = getPublicClient(chainId);
    const result = await client.readContract({
      address: config.contractAddress,
      abi: xenCryptoAbi,
      functionName: "getUserStake",
      account: address,
    });

    const r = result as unknown as {
      term: bigint;
      maturityTs: bigint;
      amount: bigint;
      apy: bigint;
    };

    return { term: r.term, maturityTs: r.maturityTs, amount: r.amount, apy: r.apy };
  } catch {
    return null;
  }
}

export async function fetchUserBalance(
  chainId: number,
  address: `0x${string}`
): Promise<bigint> {
  try {
    const config = chainConfigs.find((c) => c.chain.id === chainId);
    if (!config) return 0n;

    const client = getPublicClient(chainId);
    const result = await client.readContract({
      address: config.contractAddress,
      abi: xenCryptoAbi,
      functionName: "balanceOf",
      args: [address],
    });

    return result as bigint;
  } catch {
    return 0n;
  }
}
