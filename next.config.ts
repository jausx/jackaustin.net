import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/portal-warpin-robot-killer",
        destination: "/projects/portal-warpin-robot-killer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
