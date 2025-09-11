/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://support.network',
  generateRobotsTxt: false, // We're using app/robots.ts instead
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*'],
  transform: async (config, path) => {
    // Use default transformation
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}