"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PriceTicker } from "./price-ticker";
import { ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-xen-blue/10 blur-[120px]" />
        <div className="absolute top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--color-gradient-mid)]/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[var(--color-gradient-end)]/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-xen-blue/20 bg-xen-blue/5 px-4 py-1.5 text-sm font-medium text-xen-blue">
            <Zap size={14} />
            <span>13 Chains &middot; Free to Mint &middot; Fully Decentralized</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="gradient-text">{t("title")}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-lg text-[var(--muted-foreground)] sm:text-xl leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Price Ticker */}
          <div className="mt-8">
            <PriceTicker />
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/dashboard/ethereum"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-xen-blue to-[var(--color-gradient-end)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-xen-blue/25 transition-all hover:shadow-xl hover:shadow-xen-blue/30 hover:scale-[1.02]"
            >
              {t("cta")}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <a
              href="https://xen.network"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-[var(--foreground)] transition-all hover:bg-white/10 hover:border-white/20"
            >
              {t("learnMore")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
