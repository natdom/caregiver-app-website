import { redactEmailAddresses } from '@/lib/storage/waitlist-adapter'

// These five custom contact properties MUST already exist in the Resend
// workspace: source, waitlist_role, waitlist_consent_at,
// waitlist_consent_version and newsletter_subscribed_at. Resend does not create
// them on assignment — it rejects the whole request with 422 "One or more
// properties do not exist".
// Verified against the live API 2026-10-06. Create them once with
// POST /contact-properties (type "string"; only string and number exist, so the
// consent timestamp is stored as an ISO-8601 string). See WAITLIST.md.

export const CONTACTS_URL = 'https://api.resend.com/contacts'

// Resend's property representation is ASYMMETRIC, verified against the live API
// on 2026-10-07. Writes take a flat map — {"source": "waitlist"} — but reads
// return each property wrapped: {"source": {"value": "waitlist", "type":
// "string"}}. `readProperty` below tolerates both so neither direction can
// silently produce `[object Object]`.
export type ContactPropertyValue =
  | string
  | number
  | null
  | { value: string | number | null; type?: string }

export type ContactProperties = Record<string, ContactPropertyValue>

export interface ResendContact {
  id: string
  email: string
  first_name?: string | null
  created_at?: string
  properties?: ContactProperties
}

export function getApiKey(): string {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return apiKey
}

export async function getProviderMessage(response: Response): Promise<string> {
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

export function isContactAlreadyExistsResponse(
  response: Response,
  providerMessage: string
): boolean {
  return (
    response.status === 409 ||
    (response.status === 422 && /already exists/i.test(providerMessage))
  )
}

export async function request(
  url: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      ...init?.headers,
    },
  })
}

export function readProperty(
  properties: ContactProperties,
  key: string
): string | undefined {
  const raw = properties[key]
  const value =
    raw !== null && typeof raw === 'object' && 'value' in raw ? raw.value : raw
  if (value === null || value === undefined || value === '') {
    return undefined
  }
  return String(value)
}
