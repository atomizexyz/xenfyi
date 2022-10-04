import Head from "next/head";
import type { NextPage } from "next";

const Meta: NextPage = () => {
  const title = "XEN.fyi";
  const description =
    "XEN.fyi is a community-driven project to help users understand the XEN protocol and its ecosystem.";
  const url = "https://xen.fyi";
  const image = "https://xen.fyi/images/preview.png";
  return (
    <Head>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hexwalletapp" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Open Graph */}
      <meta property="og:url" content={url} key="ogurl" />
      <meta property="og:image" content={image} key="ogimage" />
      <meta property="og:site_name" content="" key="ogsitename" />
      <meta property="og:title" content={title} key="ogtitle" />
      <meta property="og:description" content={description} key="ogdesc" />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <title>{title}</title>
    </Head>
  );
};

export default Meta;
