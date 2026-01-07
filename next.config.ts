import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  eslint: {
    // Note: This bypasses lint errors during production builds (Netlify).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
