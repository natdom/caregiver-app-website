import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isEmailConfigured, sendContactNotification } from '@/lib/email/resend'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(1, 'Please select your role'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const submissionEvent = {
      event: 'contact_form_submitted',
      timestamp: new Date().toISOString(),
      role: validatedData.role,
      messageLength: validatedData.message.length,
    }

    console.log('Contact form submission:', submissionEvent)

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
      await sendContactNotification(validatedData)
    } catch (error) {
      const errorDetails =
        error instanceof Error
          ? { name: error.name, message: error.message }
          : { name: 'UnknownError', message: 'Resend request failed' }

      console.error('Contact form delivery error:', errorDetails)
      return NextResponse.json(
        {
          error:
            'We could not deliver your message. Please email hello@joinpero.com directly.',
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { message: "Thank you for your message. We'll be in touch soon!" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    const errorDetails =
      error instanceof Error
        ? { name: error.name, message: error.message }
        : { name: 'UnknownError', message: 'An unexpected error occurred' }

    console.error('Contact form error:', errorDetails)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
