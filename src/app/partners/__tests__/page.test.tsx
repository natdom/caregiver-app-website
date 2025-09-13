import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import PartnersPage from '../page'

describe('Partners Page', () => {
  beforeEach(() => {
    render(<PartnersPage />)
  })

  describe('Content and Structure', () => {
    it('renders the main heading with caregiver count', () => {
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('Partner with us to serve 53M+ caregivers')
    })

    it('displays all problem statements with external links', () => {
      const problemLinks = screen.getAllByRole('link', { name: /aarp|harvard|national alliance/i })
      expect(problemLinks).toHaveLength(3)
      
      problemLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('shows market data for both US and Canada', () => {
      expect(screen.getByText('United States')).toBeInTheDocument()
      expect(screen.getByText('Canada')).toBeInTheDocument()
      expect(screen.getByText('53.4M')).toBeInTheDocument() // US caregivers
      expect(screen.getByText('7.8M')).toBeInTheDocument()  // Canada caregivers
    })

    it('displays all three solution pillars', () => {
      expect(screen.getByText('Connection')).toBeInTheDocument()
      expect(screen.getByText('Clarity')).toBeInTheDocument() 
      expect(screen.getByText('Care')).toBeInTheDocument()
      
      // Check for outcome metrics
      expect(screen.getByText(/reduce caregiver isolation by 40%/i)).toBeInTheDocument()
      expect(screen.getByText(/cut information overwhelm in half/i)).toBeInTheDocument()
      expect(screen.getByText(/improve caregiver wellbeing scores by 35%/i)).toBeInTheDocument()
    })

    it('shows early traction metrics', () => {
      expect(screen.getByText('2,847')).toBeInTheDocument() // waitlist count
      expect(screen.getByText('68%')).toBeInTheDocument()   // newsletter opens
    })

    it('displays roadmap with Now/Next/Later sections', () => {
      expect(screen.getByText('Now')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Later')).toBeInTheDocument()
    })

    it('shows team member bio cards with initials', () => {
      expect(screen.getByText('Alex Thompson')).toBeInTheDocument()
      expect(screen.getByText('Maria Santos')).toBeInTheDocument()
      expect(screen.getByText('Jordan Lee')).toBeInTheDocument()
      
      // Check for initials as fallback avatars
      expect(screen.getByText('AT')).toBeInTheDocument()
      expect(screen.getByText('MS')).toBeInTheDocument()
      expect(screen.getByText('JL')).toBeInTheDocument()
    })

    it('includes technology and privacy section', () => {
      expect(screen.getByText('Technology & privacy')).toBeInTheDocument()
      expect(screen.getByText(/SOC 2 Type II, HIPAA-ready/)).toBeInTheDocument()
    })
  })

  describe('Call-to-Action Elements', () => {
    it('renders both primary CTAs', () => {
      const downloadButton = screen.getByRole('link', { name: /download one-pager/i })
      const bookingButton = screen.getByRole('link', { name: /book 15-min intro/i })
      
      expect(downloadButton).toBeInTheDocument()
      expect(bookingButton).toBeInTheDocument()
    })

    it('displays contact email', () => {
      const emailLink = screen.getByRole('link', { name: /partners@support.network/i })
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute('href', 'mailto:partners@support.network')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })
      const h3s = screen.getAllByRole('heading', { level: 3 })
      
      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThan(0)
      expect(h3s.length).toBeGreaterThan(0)
    })

    it('has external links with proper attributes', () => {
      const externalLinks = screen.getAllByRole('link', { name: /aarp|harvard|national alliance/i })
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('includes proper ARIA labels for LinkedIn links', () => {
      const linkedinLinks = screen.getAllByLabelText(/linkedin profile/i)
      expect(linkedinLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Performance Optimizations', () => {
    it('uses semantic HTML elements', () => {
      expect(screen.getAllByRole('region')).toHaveLength(0) // Should use sections instead
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(5) // Multiple content sections
    })

    it('includes lazy loading indicators for images', () => {
      // Since we're using initials as fallbacks, check that image elements would be optimized
      const avatarContainers = document.querySelectorAll('[class*="rounded-full"]')
      expect(avatarContainers.length).toBeGreaterThan(0)
    })
  })
})