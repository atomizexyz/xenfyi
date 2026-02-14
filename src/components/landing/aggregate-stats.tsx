"use client";

import { useTranslations } from "next-intl";
import NumberFlow from "@number-flow/react";
import { useXenGlobalData } from "@/hooks/use-xen-global-data";
import { Activity, Users, TrendingUp, Layers } from "lucide-react";

export function AggregateStats() {
  const t = useTranslations("stats");
  const { data } = useXenGlobalData();

  const aggregated = data
    ? {
        totalRank: data.reduce(
          (sum, c) => sum + Number(c.globalRank),
          0
        ),
        totalMinters: data.reduce(
          (sum, c) => sum + Number(c.activeMinters),
          0
        ),
        totalStakes: data.reduce(
          (sum, c) => sum + Number(c.activeStakes),
          0
        ),
        chains: data.length,
      }
    : null;

  const stats = [
    {
      label: t("globalRank"),
      value: aggregated?.totalRank ?? 0,
      icon: TrendingUp,
      format: { notation: "compact" as const, maximumFractionDigits: 1 },
    },
    {
      label: t("activeMinters"),
      value: aggregated?.totalMinters ?? 0,
      icon: Activity,
      format: { notation: "compact" as const, maximumFractionDigits: 1 },
    },
    {
      label: t("activeStakes"),
      value: aggregated?.totalStakes ?? 0,
      icon: Users,
      format: { notation: "compact" as const, maximumFractionDigits: 1 },
    },
    {
      label: t("chains"),
      value: aggregated?.chains ?? 0,
      icon: Layers,
      format: {},
    },
  ];

  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative rounded-2xl border border-white/5 bg-[var(--card)] p-5 text-center transition-all hover:border-white/10 animate-pulse-glow"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-xen-blue/10">
                <stat.icon className="h-5 w-5 text-xen-blue" />
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)] font-mono tabular-nums sm:text-3xl">
                <NumberFlow value={stat.value} format={stat.format} />
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)] font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
