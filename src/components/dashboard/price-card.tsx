"use client";

import NumberFlow from "@number-flow/react";
import { useXenPrice } from "@/hooks/use-xen-prices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface PriceCardProps {
  chainSlug: string;
}

export function PriceCard({ chainSlug }: PriceCardProps) {
  const price = useXenPrice(chainSlug);

  if (!price) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign size={14} className="text-xen-blue" />
            XEN Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[var(--muted-foreground)]">
            Price data unavailable for this chain
          </p>
        </CardContent>
      </Card>
    );
  }

  const isPositive = price.priceChange24h >= 0;

  return (
    <Card glow>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign size={14} className="text-xen-blue" />
            XEN Price
          </CardTitle>
          <Badge variant={isPositive ? "success" : "destructive"}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(price.priceChange24h).toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-2xl font-bold text-[var(--foreground)] font-mono tabular-nums">
          $<NumberFlow value={price.priceUsd} format={{ maximumSignificantDigits: 4 }} />
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/[0.03] p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 size={10} className="text-[var(--muted-foreground)]" />
              <span className="text-[10px] text-[var(--muted-foreground)]">24h Volume</span>
            </div>
            <p className="text-xs font-semibold text-[var(--foreground)] font-mono">
              $<NumberFlow
                value={price.volume24h}
                format={{ notation: "compact", maximumFractionDigits: 1 }}
              />
            </p>
          </div>
          <div className="rounded-lg bg-white/[0.03] p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign size={10} className="text-[var(--muted-foreground)]" />
              <span className="text-[10px] text-[var(--muted-foreground)]">Liquidity</span>
            </div>
            <p className="text-xs font-semibold text-[var(--foreground)] font-mono">
              $<NumberFlow
                value={price.liquidity}
                format={{ notation: "compact", maximumFractionDigits: 1 }}
              />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
