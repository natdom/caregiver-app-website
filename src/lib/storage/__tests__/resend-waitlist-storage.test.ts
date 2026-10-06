import { ResendWaitlistStorage } from '@/lib/storage/resend-waitlist-storage'
import { DuplicateWaitlistSignupError } from '@/lib/storage/waitlist-adapter'
import { WAITLIST_CONSENT_VERSION } from '@/lib/validations/waitlist'

const signup = {
  email: 'caregiver@example.com',
  name: 'Avery',
  role: 'caregiver' as const,
  consent: true,
}

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText: status >= 400 ? 'Request failed' : 'OK',
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('ResendWaitlistStorage', () => {
  const originalApiKey = process.env.RESEND_API_KEY

  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test_key'
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.RESEND_API_KEY
    } else {
      process.env.RESEND_API_KEY = originalApiKey
    }
    vi.unstubAllGlobals()
  })

  it('creates a contact with waitlist attribution and consent evidence', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({}, 404))
      .mockResolvedValueOnce(response({ id: 'contact-1' }, 201))

    const entry = await new ResendWaitlistStorage().create(signup)

    const [url, options] = fetchMock.mock.calls[1]
    const body = JSON.parse(String(options?.body))
    expect(url).toBe('https://api.resend.com/contacts')
    expect(options?.headers).toMatchObject({
      Authorization: 'Bearer re_test_key',
    })
    expect(body).toMatchObject({
      email: signup.email,
      first_name: signup.name,
      unsubscribed: false,
      properties: {
        source: 'waitlist',
        waitlist_role: 'caregiver',
        waitlist_consent_version: WAITLIST_CONSENT_VERSION,
      },
    })
    expect(new Date(body.properties.waitlist_consent_at).toISOString()).toBe(
      body.properties.waitlist_consent_at
    )
    expect(entry.id).toBe('contact-1')
    expect(entry.consentAt).toEqual(entry.submittedAt)
    expect(entry.consentVersion).toBe(WAITLIST_CONSENT_VERSION)
  })

  it('omits first_name when no name was submitted', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({}, 404))
      .mockResolvedValueOnce(response({ id: 'contact-1' }, 201))

    await new ResendWaitlistStorage().create({ ...signup, name: '' })

    const body = JSON.parse(String(fetchMock.mock.calls[1][1]?.body))
    expect(body).not.toHaveProperty('first_name')
  })

  it('updates an existing non-waitlist contact without overwriting its source', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(
        response({
          id: 'existing',
          email: signup.email,
          properties: { source: 'newsletter' },
        })
      )
      .mockResolvedValueOnce(response({ id: 'existing' }))

    const entry = await new ResendWaitlistStorage().create(signup)

    const [url, options] = fetchMock.mock.calls[1]
    const body = JSON.parse(String(options?.body))
    expect(url).toBe(
      `https://api.resend.com/contacts/${encodeURIComponent(signup.email)}`
    )
    expect(options?.method).toBe('PATCH')
    expect(body).toEqual({
      first_name: signup.name,
      properties: {
        waitlist_role: signup.role,
        waitlist_consent_at: expect.any(String),
        waitlist_consent_version: WAITLIST_CONSENT_VERSION,
      },
    })
    expect(body.properties).not.toHaveProperty('source')
    expect(body).not.toHaveProperty('unsubscribed')
    expect(entry.id).toBe('existing')
  })

  it('does not replace an existing contact name when joining the waitlist', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(
        response({
          id: 'existing',
          email: signup.email,
          first_name: 'Original',
          properties: { source: 'newsletter' },
        })
      )
      .mockResolvedValueOnce(response({ id: 'existing' }))

    const entry = await new ResendWaitlistStorage().create(signup)
    const body = JSON.parse(String(fetchMock.mock.calls[1][1]?.body))

    expect(body).not.toHaveProperty('first_name')
    expect(entry.name).toBe('Original')
  })

  it('rejects a contact that already has waitlist consent', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      response({
        id: 'existing',
        email: signup.email,
        properties: {
          source: 'newsletter',
          waitlist_consent_at: '2026-10-05T12:00:00.000Z',
        },
      })
    )

    await expect(new ResendWaitlistStorage().create(signup)).rejects.toBeInstanceOf(
      DuplicateWaitlistSignupError
    )
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('turns a create conflict into a duplicate signup error', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({}, 404))
      .mockResolvedValueOnce(response({ message: 'Contact already exists' }, 409))

    await expect(new ResendWaitlistStorage().create(signup)).rejects.toBeInstanceOf(
      DuplicateWaitlistSignupError
    )
  })

  it('includes Resend error details when contact creation fails', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({}, 404))
      .mockResolvedValueOnce(response({ message: 'API key lacks permission' }, 403))

    await expect(new ResendWaitlistStorage().create(signup)).rejects.toThrow(
      'API key lacks permission'
    )
  })

  it('redacts email addresses from provider error messages', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(response({}, 404))
      .mockResolvedValueOnce(
        response(
          { message: 'Rejected caregiver@example.com' },
          403
        )
      )

    const promise = new ResendWaitlistStorage().create(signup)
    await expect(promise).rejects.toThrow('Rejected [redacted]')
    await expect(promise).rejects.not.toThrow('caregiver')
    await expect(promise).rejects.not.toThrow('caregiver@example.com')
  })

  it('returns null when findByEmail receives a 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response({}, 404))

    await expect(
      new ResendWaitlistStorage().findByEmail(signup.email)
    ).resolves.toBeNull()
  })

  it('maps a contact returned by findByEmail', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      response({
        id: 'contact-1',
        email: signup.email,
        first_name: signup.name,
        properties: {
          source: 'waitlist',
          waitlist_role: 'caregiver',
          waitlist_consent_at: '2026-10-05T12:00:00.000Z',
          waitlist_consent_version: WAITLIST_CONSENT_VERSION,
        },
      })
    )

    await expect(
      new ResendWaitlistStorage().findByEmail(signup.email)
    ).resolves.toMatchObject({
      id: 'contact-1',
      email: signup.email,
      name: signup.name,
      role: 'caregiver',
      consent: true,
      submittedAt: new Date('2026-10-05T12:00:00.000Z'),
      consentAt: new Date('2026-10-05T12:00:00.000Z'),
      consentVersion: WAITLIST_CONSENT_VERSION,
    })
  })

  it('throws when findByEmail receives a provider error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      response({ message: 'Provider unavailable' }, 500)
    )

    await expect(
      new ResendWaitlistStorage().findByEmail(signup.email)
    ).rejects.toThrow('Provider unavailable')
  })

  it('follows pagination and excludes non-waitlist contacts', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(
        response({
          data: [
            {
              id: 'waitlist-1',
              email: 'one@example.com',
              properties: {
                source: 'newsletter',
                waitlist_role: 'caregiver',
                waitlist_consent_at: '2026-10-05T12:00:00.000Z',
              },
            },
            {
              id: 'newsletter-1',
              email: 'news@example.com',
              properties: { source: 'newsletter' },
            },
          ],
          has_more: true,
        })
      )
      .mockResolvedValueOnce(
        response({
          data: [
            {
              id: 'waitlist-2',
              email: 'two@example.com',
              properties: {
                source: 'waitlist',
                waitlist_role: 'partner',
                waitlist_consent_at: '2026-10-05T13:00:00.000Z',
              },
            },
          ],
          has_more: false,
        })
      )

    const entries = await new ResendWaitlistStorage().getAll()

    expect(entries.map(entry => entry.id)).toEqual(['waitlist-1', 'waitlist-2'])
    // `after` must be the last contact id of the previous page — Resend returns
    // no cursor field, so a cursor-based implementation would never paginate.
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://api.resend.com/contacts?limit=100'
    )
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://api.resend.com/contacts?limit=100&after=newsletter-1'
    )
  })

  it('counts only waitlist contacts', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      response({
        data: [
          {
            id: 'waitlist-1',
            email: 'one@example.com',
            properties: {
              source: 'newsletter',
              waitlist_role: 'caregiver',
              waitlist_consent_at: '2026-10-05T12:00:00.000Z',
            },
          },
          { id: 'other-1', email: 'other@example.com', properties: {} },
        ],
        has_more: false,
      })
    )

    await expect(new ResendWaitlistStorage().count()).resolves.toBe(1)
  })
})
