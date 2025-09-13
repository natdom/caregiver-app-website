import { z } from 'zod'

export const waitlistSchema = z.object({
  name: z.string().trim().optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email address').trim(),
  role: z.enum(['caregiver', 'professional', 'funder', 'other'], {
    required_error: 'Please select your role',
    invalid_type_error: 'Please select a valid role'
  }),
  challenge: z.string().trim().max(500, 'Please keep your response under 500 characters').optional().or(z.literal('')),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to receive updates to join the waitlist'
  })
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>

export interface WaitlistEntry extends WaitlistFormData {
  id: string
  submittedAt: Date
  ipAddress?: string
  userAgent?: string
}

// For form display purposes
export const roleOptions = [
  { value: 'caregiver' as const, label: 'Family Caregiver', description: 'Caring for a family member or friend' },
  { value: 'professional' as const, label: 'Healthcare Professional', description: 'Doctor, nurse, social worker, etc.' },
  { value: 'funder' as const, label: 'Investor/Funder', description: 'Looking to support our mission' },
  { value: 'other' as const, label: 'Other', description: 'Partner, researcher, or advocate' }
] as const