const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/design-system',
        permanent: false,
      },
    ]
  },
}

module.exports = withContentlayer(nextConfig)