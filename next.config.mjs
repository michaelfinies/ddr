/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    // buildActivity: false, // This specifically hides the build activity indicator
    position: "top-right", // You can still specify position even if not shown
  },
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
        source: "/logs/:id",
        destination: "/authenticated/logs/:id",
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
