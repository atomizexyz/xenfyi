import { NextResponse } from "next/server";
import { getCachedXenPrices } from "@/lib/dexscreener";

export async function GET() {
  try {
    const prices = await getCachedXenPrices();

    return NextResponse.json(prices, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Failed to fetch XEN prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
