"use client";

import { useTranslations } from "next-intl";

const socialLinks = [
  { name: "Twitter", url: "https://x.com/XEN_Crypto" },
  { name: "Telegram", url: "https://t.me/XENCryptoTalk" },
  { name: "GitHub", url: "https://github.com/FairCrypto" },
];

const resourceLinks = [
  { name: "XEN Network", url: "https://xen.network" },
  { name: "Documentation", url: "https://xen.network" },
  { name: "Source Code", url: "https://github.com/FairCrypto" },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-xen-blue to-[var(--color-gradient-end)]">
                <span className="text-sm font-bold text-white">X</span>
              </div>
              <span className="text-lg font-bold gradient-text">XEN Crypto</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
              Cryptocurrency For The Masses. Free to mint. Cross-chain. Fully decentralized.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
              {t("resources")}
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
              {t("community")}
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
                  {t("terms")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
                  {t("privacy")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="text-center text-xs text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} {t("builtBy")}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
