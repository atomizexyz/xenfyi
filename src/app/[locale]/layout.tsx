import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Web3Provider } from "@/components/providers/web3-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { routing, rtlLocales, type Locale } from "@/i18n/routing";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "XEN Crypto - Cryptocurrency For The Masses",
  description:
    "XEN Crypto is a community-driven, self-custodial cryptocurrency built on the principles of decentralization, transparency, and trust.",
  icons: { icon: "/images/xen-logo.svg" },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ThemeProvider>
          <Web3Provider>
            <NextIntlClientProvider messages={messages}>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </NextIntlClientProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
