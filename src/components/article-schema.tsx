import type { Resource } from 'contentlayer/generated'

interface ArticleSchemaProps {
  resource: Resource
}

export function ArticleSchema({ resource }: ArticleSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": resource.title,
    "description": resource.excerpt,
    "image": resource.cover ? [resource.cover] : [],
    "datePublished": resource.publishedAt,
    "dateModified": resource.updatedAt || resource.publishedAt,
    "author": {
      "@type": "Person",
      "name": resource.author,
      "jobTitle": resource.authorRole
    },
    "publisher": {
      "@type": "Organization",
      "name": "Support Network",
      "description": "A community platform for caregivers providing practical resources, support, and connection.",
      "url": "https://supportnetwork.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://supportnetwork.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://supportnetwork.com/resources/${resource.slug}`
    },
    "keywords": resource.topics?.join(", "),
    "wordCount": resource.body?.raw ? resource.body.raw.split(/\s+/).length : undefined,
    "timeRequired": resource.readingTime ? `PT${resource.readingTime}M` : undefined,
    "audience": {
      "@type": "Audience",
      "audienceType": "Caregivers"
    },
    "about": resource.topics?.map(topic => ({
      "@type": "Thing",
      "name": topic
    })),
    "articleSection": "Caregiving Resources",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "copyrightHolder": {
      "@type": "Organization", 
      "name": "Support Network"
    },
    "potentialAction": {
      "@type": "ReadAction",
      "target": `https://supportnetwork.com/resources/${resource.slug}`
    }
  }

  // Remove undefined values
  const cleanedSchemaData = JSON.parse(JSON.stringify(schemaData))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleanedSchemaData, null, 2)
      }}
    />
  )
}