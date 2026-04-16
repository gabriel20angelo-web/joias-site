import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/joias-site",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
