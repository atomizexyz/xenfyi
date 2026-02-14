import { NextResponse } from "next/server";
import { fetchChainGlobalData } from "@/lib/xen-reader";
import { getChainConfig } from "@/config/chains";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const config = getChainConfig(slug);

  if (!config) {
    return NextResponse.json({ error: "Chain not found" }, { status: 404 });
  }

  try {
    const data = await fetchChainGlobalData(config);

    if (!data) {
      return NextResponse.json(
        { error: "Failed to fetch chain data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ...data,
        globalRank: data.globalRank.toString(),
        activeMinters: data.activeMinters.toString(),
        activeStakes: data.activeStakes.toString(),
        totalSupply: data.totalSupply.toString(),
        totalXenStaked: data.totalXenStaked.toString(),
        currentAMP: data.currentAMP.toString(),
        currentAPY: data.currentAPY.toString(),
        currentEAAR: data.currentEAAR.toString(),
        currentMaxTerm: data.currentMaxTerm.toString(),
        genesisTs: data.genesisTs.toString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
        },
      }
    );
  } catch (error) {
    console.error(`Failed to fetch data for ${slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
