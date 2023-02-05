import "~/styles/main.css";

import { Analytics } from "@vercel/analytics/react";
import { ConnectKitProvider } from "connectkit";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { WagmiConfig } from "wagmi";

import Layout from "~/components/Layout";
import { client } from "~/lib/client";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <WagmiConfig client={client}>
        <ConnectKitProvider
          options={{
            disclaimer: (
              <>
                By connecting your wallet you agree to the
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://en.wikipedia.org/wiki/Terms_of_service"
                >
                  Terms of Service
                </a>
                and
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://en.wikipedia.org/wiki/Privacy_policy"
                >
                  Privacy Policy
                </a>
              </>
            ),
          }}
        >
          <Layout>
            <GoogleAnalytics trackPageViews />
            <Component {...pageProps} />
            <Analytics />
          </Layout>
        </ConnectKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
};

export default appWithTranslation(MyApp);
