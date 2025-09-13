import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/hero'
import { getHeroVariant, heroVariants } from '@/lib/feature-flags'

// Mock the feature flags module
vi.mock('@/lib/feature-flags', () => ({
  getHeroVariant: vi.fn(),
  heroVariants: {
    A: {
      headline: "Make caregiving lighter—practical guidance, real community, simple tools.",
      id: "variant-a"
    },
    B: {
      headline: "Less searching. More support. Join a community built for caregivers.",
      id: "variant-b"
    }
  }
}))

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('CTA Visibility and Accessibility', () => {
    it('renders primary CTA with correct text and accessibility attributes', () => {
      vi.mocked(getHeroVariant).mockReturnValue('A')
      render(<Hero />)
      
      const ctaButton = screen.getByTestId('hero-cta')
      const ctaLink = screen.getByRole('link', { name: /sign up for early access to support network/i })
      
      expect(ctaButton).toBeInTheDocument()
      expect(ctaLink).toBeInTheDocument()
      expect(ctaLink).toHaveAttribute('href', '/newsletter')
      expect(ctaLink).toHaveAttribute('aria-label', 'Sign up for early access to Support Network')
      expect(ctaLink).toHaveTextContent('Get early access')
    })

    it('ensures CTA button is keyboard accessible', () => {
      vi.mocked(getHeroVariant).mockReturnValue('A')
      render(<Hero />)
      
      const ctaLink = screen.getByRole('link', { name: /sign up for early access to support network/i })
      expect(ctaLink).toBeInTheDocument()
      
      // Test that the link can receive focus
      ctaLink.focus()
      expect(ctaLink).toHaveFocus()
    })

    it('displays exactly one primary CTA in hero section', () => {
      vi.mocked(getHeroVariant).mockReturnValue('A')
      render(<Hero />)
      
      const ctaButtons = screen.getAllByText('Get early access')
      expect(ctaButtons).toHaveLength(1)
      
      // Ensure no secondary CTAs are present
      expect(screen.queryByText('Explore resources')).not.toBeInTheDocument()
      expect(screen.queryByText('Join the waitlist')).not.toBeInTheDocument()
    })
  })

  describe('A/B Testing Functionality', () => {
    it('renders variant A headline when variant A is selected', () => {
      vi.mocked(getHeroVariant).mockReturnValue('A')
      render(<Hero />)
      
      const subheadline = screen.getByTestId('variant-a')
      expect(subheadline).toBeInTheDocument()
      expect(subheadline).toHaveTextContent(heroVariants.A.headline)
    })

    it('renders variant B headline when variant B is selected', () => {
      vi.mocked(getHeroVariant).mockReturnValue('B')
      render(<Hero />)
      
      const subheadline = screen.getByTestId('variant-b')
      expect(subheadline).toBeInTheDocument()
      expect(subheadline).toHaveTextContent(heroVariants.B.headline)
    })

    it('calls getHeroVariant to determine which variant to show', () => {
      vi.mocked(getHeroVariant).mockReturnValue('A')
      render(<Hero />)
      
      expect(getHeroVariant).toHaveBeenCalledTimes(1)
    })
  })

  describe('Testimonial Section', () => {
    it('renders testimonial with proper accessibility markup', () => {
      vi.mocked(getHeroVariant).mockReturnValue('A')
      render(<Hero />)
      
      const testimonialQuote = screen.getByText(/finally, a place where i don't feel alone/i)
      const authorName = screen.getByText('Maria R.')
      const authorRole = screen.getByText('Caring for aging parent')
      const authorInitials = screen.getByText('MR')
      
      expect(testimonialQuote).toBeInTheDocument()
      expect(authorName).toBeInTheDocument()
      expect(authorRole).toBeInTheDocument()
      expect(authorInitials).toBeInTheDocument()
      
      // Check that testimonial is properly structured
      expect(testimonialQuote.tagName).toBe('BLOCKQUOTE')
    })
  })

  describe('Social Proof Section', () => {
    it('renders all three social proof indicators with proper accessibility', () => {
      vi.mocked(getHeroVariant).mockReturnValue('A')
      render(<Hero />)
      
      expect(screen.getByText('Growing community')).toBeInTheDocument()
      expect(screen.getByText('Practical guidance')).toBeInTheDocument()
      expect(screen.getByText('Judgment-free space')).toBeInTheDocument()
      
      // Check for SVG icons (they're decorative and should not have roles)
      const socialProofSection = screen.getByText('Growing community').closest('div')
      const svgIcons = socialProofSection?.querySelectorAll('svg')
      expect(svgIcons).toHaveLength(3)
    })
  })

  describe('Skip to Content Compatibility', () => {
    it('maintains proper heading hierarchy for screen readers', () => {
      vi.mocked(getHeroVariant).mockReturnValue('A')
      render(<Hero />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading).toHaveTextContent('Caregiving is heavy. We\'re here to make it lighter.')
    })
  })
})