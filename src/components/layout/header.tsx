"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ConnectKitButton } from "connectkit";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/dashboard/ethereum", label: t("dashboard") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-xen-blue to-[var(--color-gradient-end)] shadow-lg">
            <span className="text-lg font-bold text-white">X</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-xen-blue to-[var(--color-gradient-end)] opacity-0 blur-lg transition-opacity group-hover:opacity-50" />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block">
            XEN
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] hover:bg-white/5"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress, ensName }) => (
              <button
                onClick={show}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  isConnected
                    ? "bg-white/5 text-[var(--foreground)] hover:bg-white/10 border border-white/10"
                    : "bg-gradient-to-r from-xen-blue to-[var(--color-gradient-end)] text-white shadow-lg hover:shadow-xen-blue/25"
                )}
              >
                {isConnected ? ensName ?? truncatedAddress : t("connect")}
              </button>
            )}
          </ConnectKitButton.Custom>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] md:hidden hover:bg-white/5"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/5 px-4 py-4 md:hidden glass">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
