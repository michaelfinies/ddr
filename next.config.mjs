/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: "/authenticated/dashboard",
      },
      {
        source: "/logs",
        destination: "/authenticated/logs",
      },
      {
        source: "/leaderboard",
        destination: "/authenticated/leaderboard",
      },
      {
        source: "/wallet",
        destination: "/authenticated/wallet",
      },
      {
        source: "/books",
        destination: "/authenticated/books",
      },
      {
        source: "/settings",
        destination: "/authenticated/settings",
      },
      {
        source: "/history",
        destination: "/authenticated/history",
      },
      {
        source: "/store",
        destination: "/authenticated/store",
      },
      {
        source: "/create-log",
        destination: "/authenticated/create-log",
      },
    ];
  },
};

export default nextConfig;
