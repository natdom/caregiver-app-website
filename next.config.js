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

// Disable contentlayer for local dev (hangs on build)
// Vercel still runs it via: contentlayer build && next build
module.exports = nextConfig
// module.exports = withContentlayer(nextConfig)