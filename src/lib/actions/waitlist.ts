'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { waitlistSchema, type WaitlistFormData } from '@/lib/validations/waitlist'
import { createWaitlistStorage } from '@/lib/storage/waitlist-adapter'
import { revalidatePath } from 'next/cache'

export interface WaitlistActionResult {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export async function submitWaitlistForm(
  prevState: WaitlistActionResult | null,
  formData: FormData
): Promise<WaitlistActionResult> {
  try {
    // Parse form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      challenge: formData.get('challenge') as string,
      consent: formData.get('consent') === 'on'
    }

    // Validate with Zod
    const validatedData = waitlistSchema.parse(rawData)

    // Get request headers for metadata
    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Store the submission
    const storage = createWaitlistStorage()
    
    try {
      await storage.create({
        ...validatedData,
        ipAddress,
        userAgent
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already registered') {
        return {
          success: false,
          message: "You're already on our waitlist! Check your email for updates.",
          errors: { email: ["This email is already registered"] }
        }
      }
      throw error
    }

    // Revalidate any pages that might show waitlist count
    revalidatePath('/partners')
    revalidatePath('/')

    // Redirect to success page with analytics data
    const searchParams = new URLSearchParams({
      role: validatedData.role,
      name: validatedData.name ? 'true' : 'false',
      challenge: validatedData.challenge ? 'true' : 'false'
    })
    
    redirect(`/waitlist/success?${searchParams.toString()}`)

  } catch (error) {
    if (error instanceof Error && error.message.startsWith('NEXT_REDIRECT')) {
      throw error // Re-throw redirect
    }
    
    // Handle validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as any
      const errors: Record<string, string[]> = {}
      
      zodError.issues.forEach((issue: any) => {
        const field = issue.path[0]
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(issue.message)
      })

      return {
        success: false,
        message: 'Please fix the errors below',
        errors
      }
    }

    // Generic error
    console.error('Waitlist submission error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.'
    }
  }
}

// Helper function to get current waitlist count (for displaying on pages)
export async function getWaitlistCount(): Promise<number> {
  try {
    const storage = createWaitlistStorage()
    return await storage.count()
  } catch (error) {
    console.error('Error getting waitlist count:', error)
    return 0
  }
}