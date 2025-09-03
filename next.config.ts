import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude SQLite from client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        os: false,
        stream: false,
        util: false,
        buffer: false,
      };
      
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
      });
    }
    
    return config;
  },
};

export default nextConfig;
