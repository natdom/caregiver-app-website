import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsletterInline } from '../newsletter-inline'

const mockPlausible = vi.fn()
Object.defineProperty(window, 'plausible', {
  value: mockPlausible,
  writable: true,
})

describe('NewsletterInline', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockPlausible.mockReset()
  })

  const submit = async (email = 'person@private-company.example') => {
    const user = userEvent.setup()
    const input = screen.getByRole('textbox', { name: /email address/i })
    await user.type(input, email)
    await user.click(screen.getByRole('button'))
    return input as HTMLInputElement
  }

  it('posts the email and source to the newsletter API', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ message: 'ok' }), { status: 200 }))
    render(<NewsletterInline source="homepage" />)

    await submit('person@example.com')

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(fetchMock).toHaveBeenCalledWith('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'person@example.com', source: 'homepage' }),
    })
  })

  it('shows a disabled loading state while the request is in flight', async () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    render(<NewsletterInline />)

    await submit()

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows success only after an ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'ok' }), { status: 200 })
    )
    render(<NewsletterInline />)

    await submit()

    await waitFor(() =>
      expect(
        screen.queryByRole('textbox', { name: /email address/i })
      ).not.toBeInTheDocument()
    )
  })

  it('shows the route error and not success for a non-2xx response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 })
    )
    render(<NewsletterInline />)

    await submit()

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument()
    expect(mockPlausible).not.toHaveBeenCalled()
  })

  it('shows the generic error and not success when fetch rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('network details'))
    render(<NewsletterInline />)

    await submit()

    expect(
      await screen.findByText('Something went wrong. Please try again.')
    ).toBeInTheDocument()
    expect(screen.queryByText('network details')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument()
    expect(mockPlausible).not.toHaveBeenCalled()
  })

  it('does not submit when the email field is empty', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const { container } = render(<NewsletterInline />)

    fireEvent.submit(container.querySelector('form')!)

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('clears the email field after a successful submission', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'ok' }), { status: 200 })
    )
    render(<NewsletterInline />)

    await submit('person@example.com')

    await waitFor(() =>
      expect(
        screen.queryByDisplayValue('person@example.com')
      ).not.toBeInTheDocument()
    )
  })

  it('tracks only source with Plausible after a successful signup', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'ok' }), { status: 200 })
    )
    render(<NewsletterInline source="resource_page" />)

    await submit('person@private-company.example')

    await waitFor(() => expect(mockPlausible).toHaveBeenCalledTimes(1))
    expect(mockPlausible).toHaveBeenCalledWith('resource_signup_inline', {
      props: { source: 'resource_page' },
    })
    expect(JSON.stringify(mockPlausible.mock.calls)).not.toContain(
      'private-company.example'
    )
  })
})
