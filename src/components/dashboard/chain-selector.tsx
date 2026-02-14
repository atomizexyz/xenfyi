"use client";

import { chainConfigs } from "@/config/chains";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ChainSelectorProps {
  currentSlug: string;
}

export function ChainSelector({ currentSlug }: ChainSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chainConfigs.map((config) => (
        <Link
          key={config.slug}
          href={`/dashboard/${config.slug}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
            currentSlug === config.slug
              ? "border border-white/20 bg-white/10 text-[var(--foreground)]"
              : "border border-white/5 bg-white/[0.02] text-[var(--muted-foreground)] hover:bg-white/5 hover:text-[var(--foreground)]"
          )}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          {config.chain.name}
        </Link>
      ))}
    </div>
  );
}
