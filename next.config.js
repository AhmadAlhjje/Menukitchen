/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3003',
      },
      {
        protocol: 'http',
        hostname: '217.76.53.136',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Increase timeout for font fetching to avoid AbortError
  httpAgentOptions: {
    keepAlive: true,
  },
}

module.exports = nextConfig
