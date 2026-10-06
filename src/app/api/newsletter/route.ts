import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  isEmailConfigured,
  sendNewsletterNotification,
} from '@/lib/email/resend'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
  role: z.string().optional(),
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
    }

    console.log('Newsletter subscription:', subscriptionEvent)

    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          error:
            'This form is temporarily unavailable. Please email hello@joinpero.com directly.',
        },
        { status: 503 }
      )
    }

    try {
      const result = await sendNewsletterNotification(validatedData)
      if (result.audienceError) {
        console.error('Newsletter audience error:', result.audienceError)
      }
    } catch (error) {
      const errorDetails =
        error instanceof Error
          ? { name: error.name, message: error.message }
          : { name: 'UnknownError', message: 'Resend request failed' }

      console.error('Newsletter delivery error:', errorDetails)
      return NextResponse.json(
        {
          error:
            'We could not process your signup. Please email hello@joinpero.com directly.',
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        message:
          "Thank you for joining! We'll keep you updated on our progress.",
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address', details: error.errors },
        { status: 400 }
      )
    }

    const errorDetails =
      error instanceof Error
        ? { name: error.name, message: error.message }
        : { name: 'UnknownError', message: 'An unexpected error occurred' }

    console.error('Newsletter signup error:', errorDetails)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
