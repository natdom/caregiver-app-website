import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
  role: z.string().optional(),
  challenge: z.string().optional(),
  source: z.string().optional(),
  assessmentStage: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = newsletterSchema.parse(body)

    const subscriptionEvent = {
      event: 'newsletter_subscription_created',
      timestamp: new Date().toISOString(),
      source: validatedData.source ?? 'website-newsletter',
      role: validatedData.role,
      assessmentStage: validatedData.assessmentStage,
      hasName: Boolean(validatedData.name),
      hasChallenge: Boolean(validatedData.challenge),
      challengeLength: validatedData.challenge?.length ?? 0,
    }

    console.log('Newsletter subscription:', subscriptionEvent)

    // TODO(#24): Add durable storage and email delivery. This route currently
    // persists nothing; the redacted event above is deliberately not a system
    // of record for newsletter subscriptions.
    // await addToNewsletterList(validatedData.email)
    // await sendWelcomeEmail(validatedData.email)

    return NextResponse.json(
      { message: 'Thank you for joining! We\'ll keep you updated on our progress.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address', details: error.errors },
        { status: 400 }
      )
    }

    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message }
      : { name: 'UnknownError', message: 'An unexpected error occurred' }

    console.error('Newsletter signup error:', errorDetails)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
