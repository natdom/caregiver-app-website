import type { Metadata } from 'next'
import { AssessmentClient } from './assessment-client'

export const metadata: Metadata = {
  title: 'Where Are You in Your Caregiving Journey? — pero',
  description:
    'Take pero\'s free 3-minute assessment. Discover your caregiving stage, understand your situation, and receive personalized next steps.',
  keywords: [
    'caregiver assessment',
    'caregiving journey',
    'caregiver support',
    'caregiving stages',
    'pero',
  ],
  openGraph: {
    title: 'Where Are You in Your Caregiving Journey?',
    description:
      'A free 3-minute self-reflection tool for caregivers. Discover your stage and get personalized next steps.',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Where+Are+You+in+Your+Caregiving+Journey%3F&subtitle=pero',
        width: 1200,
        height: 630,
        alt: 'pero – Caregiving Journey Assessment',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AssessmentPage() {
  return <AssessmentClient />
}
