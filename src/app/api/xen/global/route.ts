import { NextResponse } from "next/server";
import { fetchAllChainsGlobalData } from "@/lib/xen-reader";

// Cache global data for 15 seconds
let cachedData: Awaited<ReturnType<typeof fetchAllChainsGlobalData>> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 15_000;

export async function GET() {
  const now = Date.now();

  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(serializeData(cachedData), {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
      },
    });
  }

  try {
    const data = await fetchAllChainsGlobalData();
    cachedData = data;
    cacheTimestamp = now;

    return NextResponse.json(serializeData(data), {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Failed to fetch global XEN data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

function serializeData(
  data: Awaited<ReturnType<typeof fetchAllChainsGlobalData>>
) {
  return data.map((d) => ({
    ...d,
    globalRank: d.globalRank.toString(),
    activeMinters: d.activeMinters.toString(),
    activeStakes: d.activeStakes.toString(),
    totalSupply: d.totalSupply.toString(),
    totalXenStaked: d.totalXenStaked.toString(),
    currentAMP: d.currentAMP.toString(),
    currentAPY: d.currentAPY.toString(),
    currentEAAR: d.currentEAAR.toString(),
    currentMaxTerm: d.currentMaxTerm.toString(),
    genesisTs: d.genesisTs.toString(),
  }));
}
