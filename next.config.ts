import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: false,
  experimental: {
    authInterrupts: true,
    staleTimes: {
      static: 0,
      dynamic: 0,
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_HOST}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
