"use client";

import NumberFlow from "@number-flow/react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChainCardProps {
  chainName: string;
  slug: string;
  color: string;
  contractAddress: string;
  globalRank: string;
  activeMinters: string;
  activeStakes: string;
  totalSupply: string;
  priceUsd?: number;
  priceChange24h?: number;
}

export function ChainCard({
  chainName,
  slug,
  color,
  contractAddress,
  globalRank,
  activeMinters,
  activeStakes,
  totalSupply,
  priceUsd,
  priceChange24h,
}: ChainCardProps) {
  const rankNum = Number(globalRank);
  const mintersNum = Number(activeMinters);
  const stakesNum = Number(activeStakes);
  const supplyNum = Number(totalSupply) / 1e18;

  return (
    <Link
      href={`/dashboard/${slug}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-[var(--card)] p-5 transition-all duration-300",
        "hover:border-white/10 hover:bg-[var(--card)]/80 hover:shadow-lg hover:scale-[1.01]"
      )}
    >
      {/* Glow accent */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at top left, ${color}10, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {chainName}
            </h3>
            {priceUsd !== undefined ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[var(--muted-foreground)] font-mono">
                  ${priceUsd < 0.0001 ? priceUsd.toExponential(2) : priceUsd.toFixed(6)}
                </span>
                {priceChange24h !== undefined && (
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      priceChange24h >= 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {priceChange24h >= 0 ? "+" : ""}{priceChange24h.toFixed(1)}%
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)] font-mono">
                {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
              </p>
            )}
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className="text-[var(--muted-foreground)] transition-all group-hover:text-[var(--foreground)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      {/* Stats */}
      <div className="relative grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-[var(--muted-foreground)]">Global Rank</p>
          <p className="text-lg font-bold text-[var(--foreground)] font-mono tabular-nums">
            <NumberFlow value={rankNum} trend={1} />
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--muted-foreground)]">Active Minters</p>
          <p className="text-lg font-bold text-[var(--foreground)] font-mono tabular-nums">
            <NumberFlow value={mintersNum} />
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--muted-foreground)]">Active Stakes</p>
          <p className="text-lg font-bold text-[var(--foreground)] font-mono tabular-nums">
            <NumberFlow value={stakesNum} />
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--muted-foreground)]">Total Supply</p>
          <p className="text-sm font-bold text-[var(--foreground)] font-mono tabular-nums">
            <NumberFlow
              value={supplyNum}
              format={{ notation: "compact", maximumFractionDigits: 2 }}
            />
          </p>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div
        className="h-0.5 w-full rounded-full opacity-30"
        style={{
          background: `linear-gradient(to right, ${color}, transparent)`,
        }}
      />
    </Link>
  );
}
