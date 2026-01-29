import type { Metadata } from 'next'
import { WaitlistForm } from '@/components/waitlist-form'

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description: 'Be among the first to access a platform designed to make caregiving lighter. Join caregivers building community, finding support, and gaining practical tools.',
  keywords: ['caregiving', 'waitlist', 'support', 'community', 'healthcare', 'family caregivers'],
  openGraph: {
    title: 'Join the withCare Waitlist',
    description: 'Be among the first to access a platform designed to make caregiving lighter. Join caregivers building community, finding support, and gaining practical tools.',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Join%20the%20Waitlist&subtitle=withCare',
        width: 1200,
        height: 630,
        alt: 'withCare - Join the Waitlist',
      },
    ],
  },
}

export default async function WaitlistPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl">
              <span className="block">Join caregivers building a</span>
              <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text font-display text-transparent">
                lighter path forward
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300 sm:text-xl">
              Be among the first to access a platform that makes caregiving lighter.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-lg">
            <div className="rounded-2xl border border-white/30 bg-white/20 p-4 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-white/10">
              <WaitlistForm showTitle={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}