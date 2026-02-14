"use client";

import { useTranslations } from "next-intl";
import { useXenChainData } from "@/hooks/use-xen-global-data";
import { getChainConfig } from "@/config/chains";
import { ChainStats } from "./chain-stats";
import { MintCard } from "./mint-card";
import { StakeCard } from "./stake-card";
import { UserPosition } from "./user-position";
import { ChainSelector } from "./chain-selector";
import { ContractQR } from "./contract-qr";
import { PriceCard } from "./price-card";
import { StatsSkeleton } from "./stats-skeleton";

interface ChainDashboardProps {
  chainSlug: string;
}

export function ChainDashboard({ chainSlug }: ChainDashboardProps) {
  const t = useTranslations("dashboard");
  const { data, isLoading } = useXenChainData(chainSlug);
  const config = getChainConfig(chainSlug);

  if (!config) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <div
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {t("title", { chain: config.chain.name })}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] font-mono">
              {config.contractAddress}
            </p>
          </div>
        </div>
        <ChainSelector currentSlug={chainSlug} />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <StatsSkeleton />
          </div>
          <div className="space-y-6">
            <StatsSkeleton />
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {data && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: Stats */}
          <div className="lg:col-span-2 space-y-6">
            <ChainStats data={data} color={config.color} />
            <UserPosition chainId={config.chain.id} />
          </div>

          {/* Right column: Actions */}
          <div className="space-y-6">
            <PriceCard chainSlug={chainSlug} />
            <MintCard chainId={config.chain.id} />
            <StakeCard chainId={config.chain.id} />
            <ContractQR
              address={config.contractAddress}
              chainName={config.chain.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}
