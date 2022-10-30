/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/mint",
        destination: "/mint/1",
        permanent: false,
      },
      {
        source: "/stake",
        destination: "/stake/1",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
