"use client";

import NumberFlow from "@number-flow/react";
import { useTranslations } from "next-intl";
import {
  TrendingUp,
  Activity,
  Users,
  Coins,
  Lock,
  Zap,
  Percent,
  Clock,
} from "lucide-react";

interface ChainStatsProps {
  data: {
    globalRank: string;
    activeMinters: string;
    activeStakes: string;
    totalSupply: string;
    totalXenStaked: string;
    currentAMP: string;
    currentAPY: string;
    currentMaxTerm: string;
  };
  color: string;
}

export function ChainStats({ data, color }: ChainStatsProps) {
  const t = useTranslations("stats");

  const stats = [
    {
      label: t("globalRank"),
      value: Number(data.globalRank),
      icon: TrendingUp,
      format: {},
    },
    {
      label: t("activeMinters"),
      value: Number(data.activeMinters),
      icon: Activity,
      format: {},
    },
    {
      label: t("activeStakes"),
      value: Number(data.activeStakes),
      icon: Users,
      format: {},
    },
    {
      label: t("totalSupply"),
      value: Number(data.totalSupply) / 1e18,
      icon: Coins,
      format: { notation: "compact" as const, maximumFractionDigits: 2 },
    },
    {
      label: t("totalStaked"),
      value: Number(data.totalXenStaked) / 1e18,
      icon: Lock,
      format: { notation: "compact" as const, maximumFractionDigits: 2 },
    },
    {
      label: t("currentAMP"),
      value: Number(data.currentAMP),
      icon: Zap,
      format: {},
    },
    {
      label: t("currentAPY"),
      value: Number(data.currentAPY),
      icon: Percent,
      format: {},
      suffix: "%",
    },
    {
      label: "Max Term",
      value: Number(data.currentMaxTerm) / 86400,
      icon: Clock,
      format: { maximumFractionDigits: 0 },
      suffix: " days",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--card)] p-6">
      <h2 className="mb-6 text-lg font-semibold text-[var(--foreground)]">
        {t("globalRank").replace("Global Rank", "Global Data")}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10"
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon size={14} style={{ color }} />
              <span className="text-xs text-[var(--muted-foreground)]">
                {stat.label}
              </span>
            </div>
            <p className="text-lg font-bold text-[var(--foreground)] font-mono tabular-nums">
              <NumberFlow value={stat.value} format={stat.format} suffix={"suffix" in stat ? (stat as { suffix: string }).suffix : undefined} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
