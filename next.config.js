/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/mint",
        destination: "/mint/1",
        permanent: true,
      },
      {
        source: "/stake",
        destination: "/stake/1",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
