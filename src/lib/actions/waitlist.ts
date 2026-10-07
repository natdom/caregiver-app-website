'use server'

import { redirect } from 'next/navigation'
import { waitlistSchema } from '@/lib/validations/waitlist'
import {
  createWaitlistStorage,
  DuplicateWaitlistSignupError,
  redactEmailAddresses,
} from '@/lib/storage/waitlist-adapter'
import { revalidatePath } from 'next/cache'
import { ZodError } from 'zod'

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
      consent: formData.get('consent') === 'on'
    }

    // Validate with Zod
    const validatedData = waitlistSchema.parse(rawData)

    // Store the submission
    const storage = createWaitlistStorage()
    
    try {
      await storage.create(validatedData)
    } catch (error) {
      if (error instanceof DuplicateWaitlistSignupError) {
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
      name: validatedData.name ? 'true' : 'false'
    })
    
    redirect(`/waitlist/success?${searchParams.toString()}`)

  } catch (error) {
    if (error instanceof Error && error.message.startsWith('NEXT_REDIRECT')) {
      throw error // Re-throw redirect
    }
    
    // Handle validation errors
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {}
      
      error.issues.forEach(issue => {
        const field = String(issue.path[0])
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

    const errorDetails =
      error instanceof Error
        ? { name: error.name, message: redactEmailAddresses(error.message) }
        : { name: 'UnknownError', message: 'Waitlist storage failed' }
    console.error('Waitlist submission error:', errorDetails)
    return {
      success: false,
      message:
        'We could not save your signup. Please email hello@joinpero.com directly.'
    }
  }
}

// Helper function to get current waitlist count (for displaying on pages)
export async function getWaitlistCount(): Promise<number> {
  try {
    const storage = createWaitlistStorage()
    return await storage.count()
  } catch (error) {
    const errorDetails =
      error instanceof Error
        ? { name: error.name, message: redactEmailAddresses(error.message) }
        : { name: 'UnknownError', message: 'Waitlist storage failed' }
    console.error('Error getting waitlist count:', errorDetails)
    return 0
  }
}
