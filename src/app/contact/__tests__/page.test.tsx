import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactPage from '../page'
import { useToast } from '@/components/ui/use-toast'

vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn(),
}))

const toast = vi.fn()

async function submitContactForm() {
  const user = userEvent.setup()
  render(<ContactPage />)

  await user.type(screen.getByLabelText('Name *'), 'Test User')
  await user.type(screen.getByLabelText('Email *'), 'test@example.com')
  fireEvent.change(document.querySelector('select')!, {
    target: { value: 'caregiver' },
  })
  await user.type(
    screen.getByLabelText('Message *'),
    'This is a sufficiently long test message.'
  )
  await user.click(screen.getByRole('button', { name: 'Send message' }))
}

describe('ContactPage submit handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useToast).mockReturnValue({ toast, dismiss: vi.fn(), toasts: [] })
  })

  it.each([
    [
      503,
      'This form is temporarily unavailable. Please email hello@joinpero.com directly.',
    ],
    [
      502,
      'We could not deliver your message. Please email hello@joinpero.com directly.',
    ],
  ])('shows the API error message for a %i response', async (status, error) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status,
        json: vi.fn().mockResolvedValue({ error }),
      })
    )

    await submitContactForm()

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Something went wrong',
        description: error,
        variant: 'destructive',
      })
    })
  })

  it('uses the generic fallback when a non-ok body cannot be parsed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockRejectedValue(new SyntaxError('Invalid JSON')),
      })
    )

    await submitContactForm()

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Something went wrong',
        description: 'Please try again later or email us directly.',
        variant: 'destructive',
      })
    })
  })

  it('uses the generic fallback when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    await submitContactForm()

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Something went wrong',
        description: 'Please try again later or email us directly.',
        variant: 'destructive',
      })
    })
  })

  it('keeps the existing success path', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    await submitContactForm()

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Message sent!',
        description: "Thank you for reaching out. We'll get back to you soon.",
      })
    })
    expect(screen.getByLabelText('Name *')).toHaveValue('')
    expect(screen.getByLabelText('Email *')).toHaveValue('')
    expect(screen.getByLabelText('Message *')).toHaveValue('')
  })
})
