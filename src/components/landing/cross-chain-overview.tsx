"use client";

import { useTranslations } from "next-intl";
import { useXenGlobalData } from "@/hooks/use-xen-global-data";
import { useXenPrices } from "@/hooks/use-xen-prices";
import { ChainCard } from "./chain-card";
import { ChainCardSkeleton } from "./chain-card-skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

export function CrossChainOverview() {
  const t = useTranslations("crossChain");
  const { data, isLoading, error, refetch } = useXenGlobalData();
  const { data: prices } = useXenPrices();

  return (
    <section className="relative py-20">
      {/* Section background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-xen-blue/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">{t("title")}</span>
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)] max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 13 }).map((_, i) => (
              <ChainCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <AlertCircle className="h-8 w-8 text-error" />
            <p className="text-sm text-[var(--muted-foreground)]">
              Failed to load cross-chain data
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Chain Cards Grid */}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((chain) => {
              const price = prices?.find((p) => p.chainSlug === chain.slug);
              return (
                <ChainCard
                  key={chain.chainId}
                  chainName={chain.chainName}
                  slug={chain.slug}
                  color={chain.color}
                  contractAddress={chain.contractAddress}
                  globalRank={chain.globalRank}
                  activeMinters={chain.activeMinters}
                  activeStakes={chain.activeStakes}
                  totalSupply={chain.totalSupply}
                  priceUsd={price?.priceUsd}
                  priceChange24h={price?.priceChange24h}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
