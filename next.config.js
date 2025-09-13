// const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        source: '/press',
        destination: '/partners',
        permanent: true,
      },
    ]
  },
}

// Temporarily disable contentlayer to test hero changes
module.exports = nextConfig
// module.exports = withContentlayer(nextConfig)