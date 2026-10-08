import { Resend } from 'resend'

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
  audienceError?: ProviderErrorDetails
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
    return { name: error.name, message: error.message }
  }

  if (typeof error === 'object' && error !== null) {
    const candidate = error as { name?: unknown; message?: unknown }
    return {
      name: typeof candidate.name === 'string' ? candidate.name : 'ResendError',
      message:
        typeof candidate.message === 'string'
          ? candidate.message
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

  // DEAD PATH — see #101. Resend deprecated Audiences in favour of Segments and
  // the current contacts endpoints take no audience id, so RESEND_AUDIENCE_ID can
  // no longer hold a valid value and was removed from .env.example in #2. With it
  // unset this silently does nothing, so newsletter signups reach no list at all.
  // Replace with POST https://api.resend.com/contacts, as
  // src/lib/storage/resend-waitlist-storage.ts does.
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) {
    return {}
  }

  try {
    const audienceResult = await resend.contacts.create({
      audience_id: audienceId,
      email: signup.email,
      first_name: signup.name,
      unsubscribed: false,
    })

    return audienceResult.error
      ? { audienceError: getErrorDetails(audienceResult.error) }
      : {}
  } catch (error) {
    return { audienceError: getErrorDetails(error) }
  }
}
