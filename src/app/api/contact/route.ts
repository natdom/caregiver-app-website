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

    // TODO: Replace with actual email sending service (Resend)
    // For now, we'll just log the submission and simulate success
    
    const submission = {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
    }
    
    console.log('Contact form submission:', submission)
    
    // TODO: Send email notification
    // await sendContactFormEmail(validatedData)
    
    // TODO: Store in database or file system
    // await storeContactSubmission(submission)

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

    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}