import { Hero } from '@/components/hero'
import { FeatureGrid } from '@/components/feature-grid'
import { FeaturedResources } from '@/components/featured-resources'
import { TestimonialCarousel } from '@/components/testimonial-carousel'
import { FundingSnapshot } from '@/components/funding-snapshot'
import { NewsletterInline } from '@/components/newsletter-inline'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <FeaturedResources />
      <TestimonialCarousel />
      <FundingSnapshot />
      <NewsletterInline />
    </>
  )
}