import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Workaround pentru eroarea useInsertionEffect cu React 19
  experimental: {
    reactCompiler: false,
  },
  async redirects() {
    return [
      {
        source: "/.well-known/farcaster.json",
        destination: "https://api.farcaster.xyz/miniapps/hosted-manifest/019b100c-dd70-2b1c-d34e-46aaae9cc8aa",
        permanent: false, // 307 temporary redirect
      },
    ];
  },
};

export default nextConfig;
