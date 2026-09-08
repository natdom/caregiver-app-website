import { Hero } from '@/components/hero'
import { FeatureGrid } from '@/components/feature-grid'
import { AssessmentCTA } from '@/components/assessment-cta'
import { FeaturedResources } from '@/components/featured-resources'
import { TestimonialCarousel } from '@/components/testimonial-carousel'
import { FundingSnapshot } from '@/components/funding-snapshot'
import { NewsletterInline } from '@/components/newsletter-inline'
import { WelcomeSplash } from '@/components/welcome-splash'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.joinpero.com/#organization',
      name: 'pero',
      url: 'https://www.joinpero.com',
      description: 'pero is an app for caregivers, designed to make every caregiver\'s day a little lighter through connection, clarity, and care.',
      email: 'hello@joinpero.com',
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.joinpero.com/#website',
      url: 'https://www.joinpero.com',
      name: 'pero',
      description: 'pero is an app for caregivers. Find caregiving resources, join the waitlist, and learn about partnership opportunities.',
      publisher: {
        '@id': 'https://www.joinpero.com/#organization',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.joinpero.com/#webpage',
      url: 'https://www.joinpero.com',
      name: 'pero - An app for caregivers',
      description: 'pero is an app for caregivers, coming soon. Join the waitlist to be notified at launch.',
      isPartOf: {
        '@id': 'https://www.joinpero.com/#website',
      },
      about: {
        '@id': 'https://www.joinpero.com/#organization',
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
      <WelcomeSplash />
      <Hero />
      <FeatureGrid />
      <AssessmentCTA />
      <FeaturedResources />
      <TestimonialCarousel />
      <FundingSnapshot />
      <NewsletterInline />
    </>
  )
}