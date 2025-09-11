import type { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function generateSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: SEOProps): Metadata {
  const siteName = 'Support Network'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://support.network'
  
  const fullTitle = title 
    ? `${title} | ${siteName}`
    : `${siteName} - A supportive space for caregivers of all kinds`
    
  const defaultDescription = 'To make every caregiver\'s day a little lighter through connection, clarity, and care.'
  const metaDescription = description || defaultDescription
  
  const imageUrl = image ? `${siteUrl}${image}` : `${siteUrl}/api/og${url ? `?title=${encodeURIComponent(title || siteName)}` : ''}`
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl

  return {
    title: fullTitle,
    description: metaDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url || '/',
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: fullUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      locale: 'en_US',
      type,
      ...(type === 'article' && publishedTime && {
        publishedTime,
        modifiedTime,
        authors,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateStructuredData(type: 'website' | 'organization' | 'article', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://support.network'
  
  const commonData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'website':
      return {
        ...commonData,
        '@type': 'WebSite',
        name: 'Support Network',
        url: baseUrl,
        description: 'A supportive space for caregivers of all kinds',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }

    case 'organization':
      return {
        ...commonData,
        '@type': 'Organization',
        name: 'Support Network',
        url: baseUrl,
        description: 'Making every caregiver\'s day a little lighter through connection, clarity, and care.',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'hello@support.network',
          contactType: 'customer service',
        },
        sameAs: [
          // Add social media URLs when available
        ],
      }

    case 'article':
      return {
        ...commonData,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image ? `${baseUrl}${data.image}` : `${baseUrl}/api/og?title=${encodeURIComponent(data.title)}`,
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        author: {
          '@type': 'Person',
          name: data.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Support Network',
          url: baseUrl,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}${data.url}`,
        },
      }

    default:
      return commonData
  }
}