import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Workaround pentru eroarea useInsertionEffect cu React 19
  experimental: {
    reactCompiler: false,
  },
};

export default nextConfig;
