import {
  DuplicateWaitlistSignupError,
  redactEmailAddresses,
  type WaitlistStorage,
} from '@/lib/storage/waitlist-adapter'
import type {
  WaitlistEntry,
  WaitlistFormData,
} from '@/lib/validations/waitlist'
import { WAITLIST_CONSENT_VERSION } from '@/lib/validations/waitlist'

// Assumption: the Resend workspace permits these custom contact properties, or
// has them pre-created: source, waitlist_consent_at, waitlist_consent_version,
// and waitlist_role.

const CONTACTS_URL = 'https://api.resend.com/contacts'

// Resend caps the list endpoint at 100 per page and defaults to 20.
const PAGE_SIZE = 100

type ContactProperties = Record<string, string | number | null>

interface ResendContact {
  id: string
  email: string
  first_name?: string | null
  created_at?: string
  properties?: ContactProperties
}

interface ContactsPage {
  data: ResendContact[]
  has_more: boolean
}

function getApiKey(): string {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return apiKey
}

async function getProviderMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: unknown }
    if (typeof body.message === 'string') {
      return redactEmailAddresses(body.message)
    }
  } catch {
    // The status text below remains useful when Resend returns a non-JSON response.
  }
  return redactEmailAddresses(response.statusText || `HTTP ${response.status}`)
}

async function request(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      ...init?.headers,
    },
  })
}

function contactToEntry(contact: ResendContact): WaitlistEntry {
  const properties = contact.properties ?? {}
  const consentAtValue = properties.waitlist_consent_at ?? contact.created_at
  const consentAt = consentAtValue
    ? new Date(String(consentAtValue))
    : new Date(0)

  return {
    id: contact.id,
    email: contact.email,
    name: contact.first_name ?? undefined,
    role: properties.waitlist_role as WaitlistEntry['role'],
    consent: true,
    submittedAt: consentAt,
    consentAt,
    consentVersion: String(properties.waitlist_consent_version ?? 'unknown'),
  }
}

function isWaitlistContact(contact: ResendContact): boolean {
  return contact.properties?.waitlist_consent_at != null
}

export class ResendWaitlistStorage implements WaitlistStorage {
  async create(data: WaitlistFormData): Promise<WaitlistEntry> {
    const lookup = await request(
      `${CONTACTS_URL}/${encodeURIComponent(data.email)}`
    )

    if (!lookup.ok && lookup.status !== 404) {
      throw new Error(`Resend contact lookup failed: ${await getProviderMessage(lookup)}`)
    }

    const submittedAt = new Date()
    const waitlistProperties = {
      waitlist_role: data.role,
      waitlist_consent_at: submittedAt.toISOString(),
      waitlist_consent_version: WAITLIST_CONSENT_VERSION,
    }

    if (lookup.ok) {
      const existing = (await lookup.json()) as ResendContact
      if (isWaitlistContact(existing)) {
        throw new DuplicateWaitlistSignupError()
      }

      const body = {
        properties: waitlistProperties,
        ...(!existing.first_name && data.name ? { first_name: data.name } : {}),
      }
      const response = await request(
        `${CONTACTS_URL}/${encodeURIComponent(data.email)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        throw new Error(`Resend contact update failed: ${await getProviderMessage(response)}`)
      }

      return {
        id: existing.id,
        email: existing.email,
        name: existing.first_name || data.name || undefined,
        role: data.role,
        consent: data.consent,
        submittedAt,
        consentAt: submittedAt,
        consentVersion: WAITLIST_CONSENT_VERSION,
      }
    }

    const response = await request(CONTACTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        ...(data.name ? { first_name: data.name } : {}),
        unsubscribed: false,
        properties: {
          source: 'waitlist',
          ...waitlistProperties,
        },
      }),
    })

    if (!response.ok) {
      const providerMessage = await getProviderMessage(response)
      if (
        response.status === 409 ||
        (response.status === 422 && /already exists/i.test(providerMessage))
      ) {
        throw new DuplicateWaitlistSignupError()
      }
      throw new Error(`Resend contact creation failed: ${providerMessage}`)
    }

    const contact = (await response.json()) as { id: string }
    return {
      id: contact.id,
      email: data.email,
      name: data.name,
      role: data.role,
      consent: data.consent,
      submittedAt,
      consentAt: submittedAt,
      consentVersion: WAITLIST_CONSENT_VERSION,
    }
  }

  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    const response = await request(`${CONTACTS_URL}/${encodeURIComponent(email)}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`Resend contact lookup failed: ${await getProviderMessage(response)}`)
    }
    return contactToEntry((await response.json()) as ResendContact)
  }

  async getAll(): Promise<WaitlistEntry[]> {
    const contacts: ResendContact[] = []
    let after: string | undefined

    // Resend paginates by contact id, not by an opaque cursor: `after` takes the
    // id of the last contact on the previous page and that contact is excluded
    // from the next one. There is no `cursor` field in the response.
    do {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE) })
      if (after) {
        params.set('after', after)
      }
      const response = await request(`${CONTACTS_URL}?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`Resend contacts list failed: ${await getProviderMessage(response)}`)
      }

      const page = (await response.json()) as ContactsPage
      contacts.push(...page.data)
      after = page.has_more ? page.data.at(-1)?.id : undefined
      if (page.has_more && !after) {
        throw new Error('Resend reported more contacts but returned an empty page')
      }
    } while (after)

    return contacts
      .filter(isWaitlistContact)
      .map(contactToEntry)
  }

  async count(): Promise<number> {
    return (await this.getAll()).length
  }
}
