/**
 * Contentlayer Shim
 *
 * Provides empty data when contentlayer is disabled in local development.
 * In production (Vercel), contentlayer is built via: contentlayer build && next build
 */

// Type definitions matching contentlayer generated types
export type Resource = {
  _id: string
  _raw: any
  type: 'Resource'
  title: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
  author: string
  authorRole?: string
  topics: string[]
  readingTime?: number
  featured: boolean
  cover?: string
  coverAlt?: string
  slug: string
  url: string
  body: {
    raw: string
    code: string
  }
}

export type Page = {
  _id: string
  _raw: any
  type: 'Page'
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  slug: string
  url: string
  body: {
    raw: string
    code: string
  }
}

// Export empty arrays for local development
// In production (Vercel), contentlayer is built before next build
export const allResources: Resource[] = []
export const allPages: Page[] = []

// Log once to inform developers
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('📝 Contentlayer disabled - blog posts will not display locally')
}
