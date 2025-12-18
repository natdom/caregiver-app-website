import { render } from '@testing-library/react'
import { expect } from 'vitest'
import PartnersPage, { metadata } from '../page'

describe('Partners Page Metadata', () => {
  describe('Page Metadata', () => {
    it('has proper title and description', () => {
      expect(metadata.title).toBe('Partners')
      expect(metadata.description).toContain('Join us in building support')
      expect(metadata.description).toContain('53M+ family caregivers')
    })

    it('includes relevant keywords', () => {
      const keywords = metadata.keywords
      expect(keywords).toContain('caregiving')
      expect(keywords).toContain('partnership')
      expect(keywords).toContain('investment')
      expect(keywords).toContain('healthcare')
    })

    it('has Open Graph metadata', () => {
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBe('Partners - withCare')
      expect(metadata.openGraph?.type).toBe('website')
    })
  })

  describe('JSON-LD Structured Data', () => {
    it('includes JSON-LD script in page', () => {
      const { container } = render(<PartnersPage />)

      const jsonLdScript = container.querySelector(
        'script[type="application/ld+json"]'
      )
      expect(jsonLdScript).toBeInTheDocument()

      const jsonContent = JSON.parse(jsonLdScript?.textContent || '{}')
      expect(jsonContent['@context']).toBe('https://schema.org')
      expect(jsonContent['@type']).toBe('Organization')
    })

    it('has proper organization schema', () => {
      const { container } = render(<PartnersPage />)

      const jsonLdScript = container.querySelector(
        'script[type="application/ld+json"]'
      )
      const schema = JSON.parse(jsonLdScript?.textContent || '{}')

      expect(schema.name).toBe('withCare')
      expect(schema.description).toContain('comprehensive platform')
      expect(schema.url).toBe('https://support.network')
      expect(schema.contactPoint).toBeDefined()
      expect(schema.contactPoint.contactType).toBe('partnerships')
      expect(schema.founders).toHaveLength(1)
      expect(schema.keywords).toContain('caregiving')
    })

    it('includes contact information in schema', () => {
      const { container } = render(<PartnersPage />)

      const jsonLdScript = container.querySelector(
        'script[type="application/ld+json"]'
      )
      const schema = JSON.parse(jsonLdScript?.textContent || '{}')

      expect(schema.contactPoint.email).toBe('partners@support.network')
      expect(schema.contactPoint['@type']).toBe('ContactPoint')
    })

    it('includes founder information', () => {
      const { container } = render(<PartnersPage />)

      const jsonLdScript = container.querySelector(
        'script[type="application/ld+json"]'
      )
      const schema = JSON.parse(jsonLdScript?.textContent || '{}')

      expect(schema.founders).toHaveLength(1)
      expect(schema.founders[0].name).toBe('Alex Thompson')
      expect(schema.founders[0].jobTitle).toBe('CEO & Co-founder')
      expect(schema.founders[0]['@type']).toBe('Person')
    })
  })

  describe('SEO Optimization', () => {
    it('has meta description under 160 characters', () => {
      const descriptionLength = metadata.description?.length || 0
      expect(descriptionLength).toBeLessThanOrEqual(160)
    })

    it('has title under 60 characters', () => {
      const titleLength = metadata.title?.toString().length || 0
      expect(titleLength).toBeLessThanOrEqual(60)
    })

    it('includes partner-relevant keywords', () => {
      const keywords = metadata.keywords?.join(' ') || ''
      expect(keywords.toLowerCase()).toMatch(/partner|invest|market|opportunit/)
    })
  })
})
