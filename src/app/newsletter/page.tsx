import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Join the Waitlist - Support Network',
  description: 'Be the first to access the platform designed for family caregivers.',
}

export default function NewsletterPage() {
  // Redirect to the optimized waitlist page
  redirect('/waitlist')
}