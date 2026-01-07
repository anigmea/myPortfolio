import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Removed output: "export" to enable API routes on Netlify
  eslint: {
    // Note: This bypasses lint errors during production builds (Netlify).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
