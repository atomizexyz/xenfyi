"use client";

import NumberFlow from "@number-flow/react";
import { useXenPrices } from "@/hooks/use-xen-prices";
import { TrendingUp, TrendingDown } from "lucide-react";

export function PriceTicker() {
  const { data: prices } = useXenPrices();

  if (!prices || prices.length === 0) return null;

  // Get the Ethereum price as the main reference
  const mainPrice = prices.find((p) => p.chainSlug === "ethereum") ?? prices[0];
  if (!mainPrice) return null;

  const isPositive = mainPrice.priceChange24h >= 0;

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      <span className="text-xs font-medium text-[var(--muted-foreground)]">XEN</span>
      <span className="text-sm font-bold text-[var(--foreground)] font-mono">
        $<NumberFlow value={mainPrice.priceUsd} format={{ maximumSignificantDigits: 4 }} />
      </span>
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium ${
          isPositive ? "text-success" : "text-error"
        }`}
      >
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <NumberFlow
          value={Math.abs(mainPrice.priceChange24h)}
          format={{ maximumFractionDigits: 2 }}
          suffix="%"
        />
      </span>
    </div>
  );
}
