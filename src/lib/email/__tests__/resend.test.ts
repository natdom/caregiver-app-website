import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sendNewsletterNotification } from '@/lib/email/resend'

const { emailSendMock } = vi.hoisted(() => ({
  emailSendMock: vi.fn(),
}))

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: emailSendMock }
  },
}))

const signup = {
  email: 'subscriber-private@private-company.example',
  name: 'Avery',
  role: 'caregiver',
  source: 'footer',
  assessmentStage: 'planning',
}

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText: status >= 400 ? 'Request failed' : 'OK',
    headers: { 'Content-Type': 'application/json' },
  })
}

// Resend returns properties WRAPPED on reads — {"k": {"value": v, "type": "string"}} —
// while accepting a flat map on writes. Verified against the live API 2026-10-07.
// Every read-shaped mock must go through this, or it tests a shape Resend never sends.
function wrapped(
  properties: Record<string, string>
): Record<string, { value: string; type: string }> {
  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => [
      key,
      { value, type: 'string' },
    ])
  )
}

describe('sendNewsletterNotification', () => {
  const originalApiKey = process.env.RESEND_API_KEY

  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test_key'
    emailSendMock.mockResolvedValue({ data: { id: 'email-1' }, error: null })
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    if (originalApiKey === undefined) {
      delete process.env.RESEND_API_KEY
    } else {
      process.env.RESEND_API_KEY = originalApiKey
    }
  })

  it('creates a new newsletter contact with first-touch attribution', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({}, 404))
      .mockResolvedValueOnce(response({ id: 'contact-1' }, 201))

    await expect(sendNewsletterNotification(signup)).resolves.toEqual({})

    const [url, options] = fetchMock.mock.calls[1]
    const body = JSON.parse(String(options?.body))
    expect(url).toBe('https://api.resend.com/contacts')
    expect(options?.method).toBe('POST')
    expect(options?.headers).toMatchObject({
      Authorization: 'Bearer re_test_key',
    })
    expect(body).toEqual({
      email: signup.email,
      first_name: signup.name,
      unsubscribed: false,
      properties: {
        source: 'newsletter',
        newsletter_subscribed_at: expect.any(String),
      },
    })
    expect(new Date(body.properties.newsletter_subscribed_at).toISOString()).toBe(
      body.properties.newsletter_subscribed_at
    )
    expect(body.properties).not.toHaveProperty('role')
    expect(body.properties).not.toHaveProperty('assessmentStage')
  })

  it('adds newsletter metadata to an existing contact without changing its source', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(
        response({
          id: 'contact-1',
          email: signup.email,
          properties: wrapped({ source: 'waitlist' }),
        })
      )
      .mockResolvedValueOnce(response({ id: 'contact-1' }))

    await sendNewsletterNotification(signup)

    const [url, options] = fetchMock.mock.calls[1]
    const body = JSON.parse(String(options?.body))
    expect(url).toBe(
      `https://api.resend.com/contacts/${encodeURIComponent(signup.email)}`
    )
    expect(options?.method).toBe('PATCH')
    expect(body).toEqual({
      first_name: signup.name,
      properties: { newsletter_subscribed_at: expect.any(String) },
    })
    expect(body.properties).not.toHaveProperty('source')
  })

  it('does not overwrite newsletter join time or send a redundant update', async () => {
    const joinedAt = '2026-10-01T12:00:00.000Z'
    vi.mocked(fetch).mockResolvedValueOnce(
      response({
        id: 'contact-1',
        email: signup.email,
        first_name: 'Original',
        properties: wrapped({
          source: 'waitlist',
          newsletter_subscribed_at: joinedAt,
        }),
      })
    )

    await expect(sendNewsletterNotification(signup)).resolves.toEqual({})

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('does not clobber an existing first name', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(
        response({
          id: 'contact-1',
          email: signup.email,
          first_name: 'Original',
          properties: wrapped({ source: 'waitlist' }),
        })
      )
      .mockResolvedValueOnce(response({ id: 'contact-1' }))

    await sendNewsletterNotification(signup)

    const body = JSON.parse(String(fetchMock.mock.calls[1][1]?.body))
    expect(body).not.toHaveProperty('first_name')
  })

  it('sends a name-only update when newsletter metadata already exists', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(
        response({
          id: 'contact-1',
          email: signup.email,
          properties: wrapped({
            newsletter_subscribed_at: '2026-10-01T12:00:00.000Z',
          }),
        })
      )
      .mockResolvedValueOnce(response({ id: 'contact-1' }))

    await sendNewsletterNotification(signup)

    const body = JSON.parse(String(fetchMock.mock.calls[1][1]?.body))
    expect(body).toEqual({ first_name: signup.name })
    expect(body).not.toHaveProperty('properties')
  })

  it('recovers when contact creation loses a race and updates the new contact', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({}, 404))
      .mockResolvedValueOnce(response({ message: 'Contact already exists' }, 409))
      .mockResolvedValueOnce(
        response({
          id: 'contact-1',
          email: signup.email,
          properties: wrapped({ source: 'waitlist' }),
        })
      )
      .mockResolvedValueOnce(response({ id: 'contact-1' }))

    await expect(sendNewsletterNotification(signup)).resolves.toEqual({})

    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(fetchMock.mock.calls[2][0]).toBe(
      `https://api.resend.com/contacts/${encodeURIComponent(signup.email)}`
    )
    expect(fetchMock.mock.calls[2][1]?.method).toBeUndefined()
    const body = JSON.parse(String(fetchMock.mock.calls[3][1]?.body))
    expect(fetchMock.mock.calls[3][1]?.method).toBe('PATCH')
    expect(body).toEqual({
      first_name: signup.name,
      properties: { newsletter_subscribed_at: expect.any(String) },
    })
    expect(body.properties).not.toHaveProperty('source')
  })

  it('skips the race-recovery PATCH when another newsletter request completed first', async () => {
    const joinedAt = '2026-10-01T12:00:00.000Z'
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({}, 404))
      .mockResolvedValueOnce(
        response({ message: 'Contact already exists' }, 422)
      )
      .mockResolvedValueOnce(
        response({
          id: 'contact-1',
          email: signup.email,
          first_name: signup.name,
          properties: wrapped({ newsletter_subscribed_at: joinedAt }),
        })
      )

    await expect(sendNewsletterNotification(signup)).resolves.toEqual({})

    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it.each([
    ['lookup', [response({ message: `Rejected ${signup.email}` }, 403)]],
    [
      'write',
      [
        response({}, 404),
        response({ message: `Rejected ${signup.email}` }, 422),
      ],
    ],
  ])('reports a redacted contactError when the %s fails', async (_label, replies) => {
    const fetchMock = vi.mocked(fetch)
    for (const reply of replies) {
      fetchMock.mockResolvedValueOnce(reply)
    }

    const result = await sendNewsletterNotification(signup)

    expect(result.contactError).toEqual({
      name: 'ResendContactError',
      message: 'Rejected [redacted]',
    })
    expect(JSON.stringify(result)).not.toContain(signup.email)
  })

  it('still throws when notification email delivery fails', async () => {
    emailSendMock.mockResolvedValue({
      data: null,
      error: { name: 'ResendError', message: 'Email delivery failed' },
    })

    await expect(sendNewsletterNotification(signup)).rejects.toThrow(
      'Email delivery failed'
    )
    expect(fetch).not.toHaveBeenCalled()
  })

  it('redacts an encoded contact URL when fetch rejects', async () => {
    const encodedEmail = encodeURIComponent(signup.email)
    vi.mocked(fetch).mockRejectedValueOnce(
      new Error(`Request failed for https://api.resend.com/contacts/${encodedEmail}`)
    )

    const result = await sendNewsletterNotification(signup)

    expect(result.contactError?.message).toContain('[redacted]')
    expect(result.contactError?.message).not.toContain(signup.email)
    expect(result.contactError?.message).not.toContain(encodedEmail)
  })
})
