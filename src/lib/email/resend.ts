import { Resend } from 'resend'
import {
  CONTACTS_URL,
  getProviderMessage,
  isContactAlreadyExistsResponse,
  readProperty,
  request,
  type ResendContact,
} from '@/lib/resend/contacts'
import { redactEmailAddresses } from '@/lib/storage/waitlist-adapter'

const DEFAULT_FROM = 'pero <hello@joinpero.com>'
const DEFAULT_CONTACT_INBOX = 'hello@joinpero.com'

export interface ContactSubmission {
  name: string
  email: string
  role: string
  message: string
}

export interface NewsletterSignup {
  email: string
  name?: string
  role?: string
  source?: string
  assessmentStage?: string
}

export interface ProviderErrorDetails {
  name: string
  message: string
}

export interface NewsletterNotificationResult {
  contactError?: ProviderErrorDetails
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  return new Resend(apiKey)
}

function getErrorDetails(error: unknown): ProviderErrorDetails {
  if (error instanceof Error) {
    return { name: error.name, message: redactEmailAddresses(error.message) }
  }

  if (typeof error === 'object' && error !== null) {
    const candidate = error as { name?: unknown; message?: unknown }
    return {
      name: typeof candidate.name === 'string' ? candidate.name : 'ResendError',
      message:
        typeof candidate.message === 'string'
          ? redactEmailAddresses(candidate.message)
          : 'Resend request failed',
    }
  }

  return { name: 'ResendError', message: 'Resend request failed' }
}

function providerError(error: unknown): Error {
  const details = getErrorDetails(error)
  const result = new Error(details.message)
  result.name = details.name
  return result
}

export async function sendContactNotification(
  submission: ContactSubmission
): Promise<void> {
  const resend = getClient()
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || DEFAULT_FROM,
    to: process.env.CONTACT_INBOX || DEFAULT_CONTACT_INBOX,
    reply_to: submission.email,
    subject: `New contact form submission from ${submission.name}`,
    text: [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Role: ${submission.role}`,
      '',
      'Message:',
      submission.message,
    ].join('\n'),
  })

  if (error) {
    throw providerError(error)
  }
}

export async function sendNewsletterNotification(
  signup: NewsletterSignup
): Promise<NewsletterNotificationResult> {
  const resend = getClient()
  const fields = [
    `Email: ${signup.email}`,
    signup.name ? `Name: ${signup.name}` : undefined,
    signup.role ? `Role: ${signup.role}` : undefined,
    signup.source ? `Source: ${signup.source}` : undefined,
    signup.assessmentStage
      ? `Assessment stage: ${signup.assessmentStage}`
      : undefined,
  ].filter((field): field is string => Boolean(field))

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || DEFAULT_FROM,
    to: process.env.CONTACT_INBOX || DEFAULT_CONTACT_INBOX,
    reply_to: signup.email,
    subject: 'New newsletter signup',
    text: fields.join('\n'),
  })

  if (error) {
    throw providerError(error)
  }

  try {
    const contactUrl = `${CONTACTS_URL}/${encodeURIComponent(signup.email)}`
    const lookup = await request(contactUrl)

    const contactError = (message: string): NewsletterNotificationResult => ({
      contactError: { name: 'ResendContactError', message },
    })

    const updateExistingContact = async (
      existing: ResendContact,
      subscribedAt: string
    ): Promise<NewsletterNotificationResult> => {
      const body = {
        ...(!existing.first_name && signup.name
          ? { first_name: signup.name }
          : {}),
        ...(!readProperty(existing.properties ?? {}, 'newsletter_subscribed_at')
          ? { properties: { newsletter_subscribed_at: subscribedAt } }
          : {}),
      }

      if (Object.keys(body).length === 0) {
        return {}
      }

      const response = await request(contactUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      return response.ok
        ? {}
        : contactError(await getProviderMessage(response))
    }

    if (!lookup.ok && lookup.status !== 404) {
      return contactError(await getProviderMessage(lookup))
    }

    const subscribedAt = new Date().toISOString()
    if (lookup.status === 404) {
      const response = await request(CONTACTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signup.email,
          ...(signup.name ? { first_name: signup.name } : {}),
          unsubscribed: false,
          properties: {
            source: 'newsletter',
            newsletter_subscribed_at: subscribedAt,
          },
        }),
      })

      if (!response.ok) {
        const providerMessage = await getProviderMessage(response)
        if (!isContactAlreadyExistsResponse(response, providerMessage)) {
          return contactError(providerMessage)
        }

        const retryLookup = await request(contactUrl)
        if (!retryLookup.ok) {
          return contactError(await getProviderMessage(retryLookup))
        }
        return updateExistingContact(
          (await retryLookup.json()) as ResendContact,
          subscribedAt
        )
      }
      return {}
    }

    return updateExistingContact(
      (await lookup.json()) as ResendContact,
      subscribedAt
    )
  } catch (error) {
    return { contactError: getErrorDetails(error) }
  }
}
