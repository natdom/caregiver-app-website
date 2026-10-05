import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

    // TODO(#24): Add durable storage and email delivery. This route currently
    // persists nothing; the redacted event above is deliberately not a system
    // of record for contact submissions.
    // await sendContactFormEmail(validatedData)
    // await storeContactSubmission(validatedData)

    return NextResponse.json(
      { message: 'Thank you for your message. We\'ll be in touch soon!' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message }
      : { name: 'UnknownError', message: 'An unexpected error occurred' }

    console.error('Contact form error:', errorDetails)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
