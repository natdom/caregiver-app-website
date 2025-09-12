import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
  role: z.string().optional(), 
  challenge: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = newsletterSchema.parse(body)

    // TODO: Replace with actual email service integration (Resend, Mailchimp, etc.)
    // For now, we'll just log the subscription and simulate success
    
    const subscription = {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
      source: 'website-newsletter',
    }
    
    console.log('Newsletter subscription:', subscription)
    
    // TODO: Add to email marketing service
    // await addToNewsletterList(validatedData.email)
    
    // TODO: Send welcome email
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

    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}