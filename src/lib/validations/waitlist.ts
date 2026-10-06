import { z } from 'zod'

export const WAITLIST_CONSENT_VERSION = '2026-10-05-waitlist-v1'

export const waitlistSchema = z.object({
  name: z.string().trim().optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email address').trim(),
  role: z.enum(['caregiver', 'professional', 'partner', 'other'], {
    required_error: 'Please select your role',
    invalid_type_error: 'Please select a valid role',
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to receive updates to join the waitlist',
  }),
})

export type WaitlistFormData = z.infer<typeof waitlistSchema>

export interface WaitlistEntry extends WaitlistFormData {
  id: string
  submittedAt: Date
  consentAt: Date
  consentVersion: string
}

// For form display purposes
export const roleOptions = [
  {
    value: 'caregiver' as const,
    label: 'Family Caregiver',
    description: 'Caring for a family member or friend',
  },
  {
    value: 'professional' as const,
    label: 'Healthcare Professional',
    description: 'Doctor, nurse, social worker, etc.',
  },
  {
    value: 'partner' as const,
    label: 'Partner',
    description:
      'Investor, funder, or organization interested in supporting our mission',
  },
  {
    value: 'other' as const,
    label: 'Other',
    description: 'Researcher, advocate, or other interest',
  },
] as const
