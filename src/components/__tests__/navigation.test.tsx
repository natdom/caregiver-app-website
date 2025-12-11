import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from '@/components/navigation'

// Mock next/navigation
const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('Navigation Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
    vi.clearAllMocks()
  })

  describe('Sticky CTA Visibility', () => {
    it('renders sticky navigation CTA in desktop view', () => {
      render(<Navigation />)
      
      const desktopCTA = screen.getByTestId('nav-cta')
      const desktopCtaLink = desktopCTA.querySelector('a')!
      
      expect(desktopCTA).toBeInTheDocument()
      expect(desktopCtaLink).toBeInTheDocument()
      expect(desktopCtaLink).toHaveAttribute('href', '/newsletter')
      expect(desktopCtaLink).toHaveAttribute('aria-label', 'Get early access to withCare')
      expect(desktopCtaLink).toHaveTextContent('Get early access')
    })

    it('renders mobile navigation CTA when mobile menu is open', async () => {
      const user = userEvent.setup()
      render(<Navigation />)
      
      // Open mobile menu
      const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
      await user.click(mobileMenuButton)
      
      const mobileCTA = screen.getByTestId('mobile-nav-cta')
      const allCtaLinks = screen.getAllByRole('link', { name: /get early access to support network/i })
      const mobileCtaLink = allCtaLinks.find(link => link.getAttribute('data-testid') === 'mobile-nav-cta')!
      
      expect(mobileCTA).toBeInTheDocument()
      expect(mobileCtaLink).toHaveAttribute('href', '/newsletter')
      expect(mobileCtaLink).toHaveAttribute('aria-label', 'Get early access to withCare')
      expect(mobileCtaLink).toHaveTextContent('Get early access')
    })

    it('ensures CTA is always visible in navigation bar', () => {
      render(<Navigation />)
      
      // Check that CTA is present in the persistent sticky navigation
      const navigationElement = screen.getByRole('navigation', { name: /main navigation/i })
      expect(navigationElement).toBeInTheDocument()
      
      const stickyCtaLink = screen.getByTestId('nav-cta').querySelector('a')!
      expect(stickyCtaLink).toBeInTheDocument()
      
      // Verify the navigation has sticky positioning classes
      const header = navigationElement.closest('header')
      expect(header).toHaveClass('sticky', 'top-0')
    })
  })

  describe('Accessibility Compliance', () => {
    it('provides proper ARIA labels and roles', () => {
      render(<Navigation />)
      
      // Navigation landmark
      const nav = screen.getByRole('navigation', { name: /main navigation/i })
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
      
      // Logo link
      const logoLink = screen.getByRole('link', { name: /support network/i })
      expect(logoLink).toBeInTheDocument()
      
      // CTA button
      const ariaCtaLink = screen.getByTestId('nav-cta').querySelector('a')!
      expect(ariaCtaLink).toHaveAttribute('aria-label', 'Get early access to withCare')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Navigation />)
      
      // Test tab navigation through menu items
      const logoLink = screen.getByRole('link', { name: /support network/i })
      const homeLink = screen.getByRole('link', { name: /home/i })
      const keyboardCtaLink = screen.getByTestId('nav-cta').querySelector('a')!
      
      // Start navigation
      await user.tab()
      expect(logoLink).toHaveFocus()
      
      await user.tab()
      expect(homeLink).toHaveFocus()
      
      // Skip through other nav items to CTA
      await user.tab() // About
      await user.tab() // Resources  
      await user.tab() // Press
      await user.tab() // Contact
      await user.tab() // CTA
      expect(keyboardCtaLink).toHaveFocus()
    })

    it('handles mobile menu keyboard interactions', async () => {
      const user = userEvent.setup()
      render(<Navigation />)
      
      const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
      
      // Open menu with keyboard
      mobileMenuButton.focus()
      expect(mobileMenuButton).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true')
      
      // Close menu with Escape key
      await user.keyboard('{Escape}')
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('provides proper focus management for mobile menu', async () => {
      const user = userEvent.setup()
      render(<Navigation />)
      
      const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
      await user.click(mobileMenuButton)
      
      // Verify mobile menu structure
      const mobileMenu = screen.getByRole('menu')
      expect(mobileMenu).toBeInTheDocument()
      expect(mobileMenu).toHaveAttribute('id', 'mobile-menu')
      
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems).toHaveLength(5) // 5 navigation items
      
      menuItems.forEach(item => {
        expect(item).toHaveAttribute('role', 'menuitem')
      })
    })

    it('ensures proper color contrast and focus states', () => {
      render(<Navigation />)
      
      // Check that focus-visible classes are present for keyboard navigation
      const navLinks = screen.getAllByRole('link')
      navLinks.forEach(link => {
        const classes = link.className
        expect(classes).toMatch(/focus-visible:/)
      })
      
      // Check mobile menu button has proper focus styling
      const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
      expect(mobileMenuButton.className).toMatch(/focus-visible:/)
    })
  })

  describe('CTA Button Functionality', () => {
    it('navigates to newsletter page when CTA is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)
      
      const functionalCtaLink = screen.getByTestId('nav-cta')
      expect(functionalCtaLink).toHaveAttribute('href', '/newsletter')
      
      // The actual navigation would be handled by Next.js Link component
      // We just verify the href is correct
      await user.click(functionalCtaLink)
    })

    it('closes mobile menu when mobile CTA is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)
      
      // Open mobile menu
      const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
      await user.click(mobileMenuButton)
      
      // Click mobile CTA
      const mobileCTA = screen.getByTestId('mobile-nav-cta').querySelector('a')!
      await user.click(mobileCTA)
      
      // Menu should close
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Skip to Content Integration', () => {
    it('maintains proper landmark structure for screen readers', () => {
      render(<Navigation />)
      
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      
      const nav = screen.getByRole('navigation', { name: /main navigation/i })
      expect(nav).toBeInTheDocument()
      
      // Verify proper nesting
      expect(header).toContainElement(nav)
    })
  })
})