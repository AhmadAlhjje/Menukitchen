/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'localhost:3003'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Increase timeout for font fetching to avoid AbortError
  httpAgentOptions: {
    keepAlive: true,
  },
}

module.exports = nextConfig
