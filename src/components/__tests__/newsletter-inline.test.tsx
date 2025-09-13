import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NewsletterInline } from '../newsletter-inline'

// Mock Plausible
const mockPlausible = vi.fn()
Object.defineProperty(window, 'plausible', {
  value: mockPlausible,
  writable: true
})

describe('NewsletterInline', () => {
  beforeEach(() => {
    mockPlausible.mockClear()
  })

  it('renders the newsletter signup form', () => {
    render(<NewsletterInline />)

    expect(screen.getByText('Get more resources like this')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get the kit/i })).toBeInTheDocument()
  })

  it('shows loading state when submitting', async () => {
    render(<NewsletterInline />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /get the kit/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    expect(screen.getByText('Joining...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('shows success state after successful submission', async () => {
    render(<NewsletterInline />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /get the kit/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Thanks for joining!')).toBeInTheDocument()
      expect(screen.getByText('Check your email for our caregiving starter kit.')).toBeInTheDocument()
    })
  })

  it('tracks analytics event on successful signup', async () => {
    render(<NewsletterInline source="test_source" />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /get the kit/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    expect(mockPlausible).toHaveBeenCalledWith('resource_signup_inline', {
      props: { 
        source: 'test_source', 
        email_domain: 'example.com' 
      }
    })
  })

  it('handles email domain extraction correctly', async () => {
    render(<NewsletterInline />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /get the kit/i })

    fireEvent.change(emailInput, { target: { value: 'user@gmail.com' } })
    fireEvent.click(submitButton)

    expect(mockPlausible).toHaveBeenCalledWith('resource_signup_inline', {
      props: { 
        source: 'resource_inline', 
        email_domain: 'gmail.com' 
      }
    })
  })

  it('handles malformed email gracefully', async () => {
    render(<NewsletterInline />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /get the kit/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    expect(mockPlausible).toHaveBeenCalledWith('resource_signup_inline', {
      props: { 
        source: 'resource_inline', 
        email_domain: 'unknown' 
      }
    })
  })

  it('renders in compact mode', () => {
    render(<NewsletterInline compact={true} />)

    const submitButton = screen.getByRole('button', { name: /get the kit/i })
    expect(submitButton).toHaveClass('h-8') // sm size class
  })

  it('applies custom className', () => {
    render(<NewsletterInline className="custom-class" />)

    const container = screen.getByText('Get more resources like this').closest('div')
    expect(container).toHaveClass('custom-class')
  })

  it('disables submit button when email is empty', () => {
    render(<NewsletterInline />)

    const submitButton = screen.getByRole('button', { name: /get the kit/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when valid email is entered', () => {
    render(<NewsletterInline />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /get the kit/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(submitButton).not.toBeDisabled()
  })

  it('shows privacy notice', () => {
    render(<NewsletterInline />)

    expect(screen.getByText('No spam. Unsubscribe anytime. We respect your privacy.')).toBeInTheDocument()
  })

  it('displays subscriber count', () => {
    render(<NewsletterInline />)

    expect(screen.getByText(/Join 2,000\+ caregivers/)).toBeInTheDocument()
  })

  it('resets form after successful submission', async () => {
    render(<NewsletterInline />)

    const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    const submitButton = screen.getByRole('button', { name: /get the kit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Thanks for joining!')).toBeInTheDocument()
    })

    // Email should be cleared
    expect(emailInput.value).toBe('')
  })
})