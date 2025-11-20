/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
  },
  // Increase timeout for font fetching to avoid AbortError
  httpAgentOptions: {
    keepAlive: true,
  },
}

module.exports = nextConfig
