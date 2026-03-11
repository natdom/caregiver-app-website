import { Hero } from '@/components/hero'
import { FeatureGrid } from '@/components/feature-grid'
import { FeaturedResources } from '@/components/featured-resources'
import { TestimonialCarousel } from '@/components/testimonial-carousel'
import { FundingSnapshot } from '@/components/funding-snapshot'
import { NewsletterInline } from '@/components/newsletter-inline'

// TODO: Update all URLs below once the site is deployed to the final domain
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://pero.app/#organization',
      name: 'pero',
      url: 'https://pero.app',
      description: 'pero is an app for caregivers, designed to make every caregiver\'s day a little lighter through connection, clarity, and care.',
      email: 'hello@pero.app',
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://pero.app/#website',
      url: 'https://pero.app',
      name: 'pero',
      description: 'pero is an app for caregivers. Find caregiving resources, join the waitlist, and learn about partnership opportunities.',
      publisher: {
        '@id': 'https://pero.app/#organization',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://pero.app/#webpage',
      url: 'https://pero.app',
      name: 'pero - An app for caregivers',
      description: 'pero is an app for caregivers, coming soon. Join the waitlist to be notified at launch.',
      isPartOf: {
        '@id': 'https://pero.app/#website',
      },
      about: {
        '@id': 'https://pero.app/#organization',
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <FeatureGrid />
      <FeaturedResources />
      <TestimonialCarousel />
      <FundingSnapshot />
      <NewsletterInline />
    </>
  )
}