import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "You're in – withCare",
  description: "Thanks for joining the withCare waitlist. We'll be in touch soon.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function WaitlistSuccessPage() {
  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-xl text-center">

          <div className="flex justify-center mb-8">
            <div className="bg-teal-500 rounded-full p-4">
              <CheckCircle className="h-10 w-10 text-white" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl mb-4">
            You're in
          </h1>

          <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-3">
            Welcome to the withCare community.
          </p>

          <p className="text-neutral-500 dark:text-neutral-400 mb-10">
            We'll be in touch soon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">
                Back to home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resources">
                Explore Guides & Insights
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
