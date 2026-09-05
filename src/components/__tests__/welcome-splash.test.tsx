import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeSplash } from '@/components/welcome-splash'
import { trackSplashEvent } from '@/lib/splash/analytics'

vi.mock('@/lib/splash/analytics', () => ({
  trackSplashEvent: vi.fn(),
}))

const mockTrackSplashEvent = vi.mocked(trackSplashEvent)

const SPLASH_SEEN_KEY = 'pero_splash_seen'

describe('WelcomeSplash', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  describe('First-visit behavior', () => {
    it('opens the dialog and tracks splash_shown when no localStorage flag is set', async () => {
      render(<WelcomeSplash />)

      const dialog = await screen.findByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(mockTrackSplashEvent).toHaveBeenCalledWith('splash_shown')
    })

    it('gives the dialog an accessible name from the title', async () => {
      render(<WelcomeSplash />)

      const dialog = await screen.findByRole('dialog', { name: /welcome to pero/i })
      expect(dialog).toBeInTheDocument()
    })

    it('does not open the dialog when pero_splash_seen is already set', () => {
      window.localStorage.setItem(SPLASH_SEEN_KEY, '1')

      render(<WelcomeSplash />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(mockTrackSplashEvent).not.toHaveBeenCalledWith('splash_shown')
    })
  })

  describe('Content', () => {
    it('renders the assessment and browse CTAs', async () => {
      render(<WelcomeSplash />)
      await screen.findByRole('dialog')

      const assessmentLink = screen.getByRole('link', { name: /take the assessment/i })
      expect(assessmentLink).toHaveAttribute('href', '/assessment')

      expect(screen.getByRole('button', { name: /browse the site/i })).toBeInTheDocument()
    })
  })

  describe('Dismissal', () => {
    it('closes on "Browse the site", marks localStorage seen, and tracks splash_browse_clicked', async () => {
      const user = userEvent.setup()
      render(<WelcomeSplash />)
      await screen.findByRole('dialog')

      await user.click(screen.getByRole('button', { name: /browse the site/i }))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(window.localStorage.getItem(SPLASH_SEEN_KEY)).toBe('1')
      expect(mockTrackSplashEvent).toHaveBeenCalledWith('splash_browse_clicked')
    })

    it('marks localStorage seen and tracks splash_assessment_clicked when the assessment link is clicked', async () => {
      const user = userEvent.setup()
      render(<WelcomeSplash />)
      await screen.findByRole('dialog')

      await user.click(screen.getByRole('link', { name: /take the assessment/i }))

      expect(window.localStorage.getItem(SPLASH_SEEN_KEY)).toBe('1')
      expect(mockTrackSplashEvent).toHaveBeenCalledWith('splash_assessment_clicked')
    })

    it('closes on Escape, marks localStorage seen, and tracks splash_dismissed', async () => {
      const user = userEvent.setup()
      render(<WelcomeSplash />)
      await screen.findByRole('dialog')

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(window.localStorage.getItem(SPLASH_SEEN_KEY)).toBe('1')
      expect(mockTrackSplashEvent).toHaveBeenCalledWith('splash_dismissed')
    })

    it('closes via the close (X) button, marks localStorage seen, and tracks splash_dismissed', async () => {
      const user = userEvent.setup()
      render(<WelcomeSplash />)
      await screen.findByRole('dialog')

      await user.click(screen.getByRole('button', { name: /close/i }))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(window.localStorage.getItem(SPLASH_SEEN_KEY)).toBe('1')
      expect(mockTrackSplashEvent).toHaveBeenCalledWith('splash_dismissed')
    })

    it('never reopens after being dismissed within the same mounted instance', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<WelcomeSplash />)
      await screen.findByRole('dialog')

      await user.click(screen.getByRole('button', { name: /browse the site/i }))
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      rerender(<WelcomeSplash />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
