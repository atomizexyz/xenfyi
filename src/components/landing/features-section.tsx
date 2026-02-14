"use client";

import { useTranslations } from "next-intl";
import {
  Sparkles,
  Globe,
  Shield,
  Users,
  Lock,
  Fingerprint,
} from "lucide-react";

const features = [
  { key: "fairLaunch", icon: Sparkles },
  { key: "multiChain", icon: Globe },
  { key: "selfCustodial", icon: Shield },
  { key: "proofOfParticipation", icon: Fingerprint },
  { key: "communityDriven", icon: Users },
  { key: "immutable", icon: Lock },
] as const;

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">{t("title")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group relative rounded-2xl border border-white/5 bg-[var(--card)] p-6 transition-all duration-300 hover:border-white/10 hover:bg-[var(--card)]/80"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-xen-blue/20 to-[var(--color-gradient-end)]/10">
                <Icon className="h-6 w-6 text-xen-blue" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                {t(key)}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
