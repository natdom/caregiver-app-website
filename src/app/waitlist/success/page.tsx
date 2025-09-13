import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { CheckCircle, Twitter, Linkedin, ArrowRight, BookOpen, Heart } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import SuccessPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Welcome to the Support Network Community!',
  description: "You're in! Thanks for joining our waitlist. Get ready for a platform that makes caregiving lighter through connection, clarity, and care.",
  openGraph: {
    title: 'I just joined the Support Network waitlist!',
    description: "A platform designed to make caregiving lighter. Join thousands of caregivers, professionals, and advocates building the support network we all deserve.",
    type: 'website',
    images: [
      {
        url: '/api/og?title=Waitlist%20Success&subtitle=Welcome%20to%20Support%20Network',
        width: 1200,
        height: 630,
        alt: 'Support Network - Waitlist Success',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'I just joined the Support Network waitlist!',
    description: "A platform designed to make caregiving lighter. Join the movement! 💙",
  },
  robots: {
    index: false, // Don't index success pages
    follow: true,
  },
}

const topResources = [
  {
    title: "5-Minute Caregiver Stress Reset",
    description: "Quick techniques to manage overwhelm in the moment",
    href: "/resources/stress-reset", // TODO: Add actual resource links
    category: "Wellbeing"
  },
  {
    title: "Essential Questions for Doctor Visits", 
    description: "A printable guide to make medical appointments more productive",
    href: "/resources/doctor-visit-guide", // TODO: Add actual resource links
    category: "Healthcare"
  },
  {
    title: "Building Your Care Team",
    description: "How to identify and organize support from family and friends",
    href: "/resources/care-team-guide", // TODO: Add actual resource links
    category: "Support"
  }
]

export default function WaitlistSuccessPage() {
  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 min-h-screen">
      
      {/* Success Hero */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-teal-500 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-white" aria-hidden="true" />
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl mb-6">
              You're in! 
              <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent">
                Welcome to Support Network
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              Thanks for joining our community of caregivers, professionals, and advocates. 
              You'll be the first to know when we launch, plus get exclusive early access.
            </p>

            {/* What's Next */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8 mb-12">
              <h2 className="text-2xl font-semibold text-neutral-700 dark:text-white mb-4">
                What happens next?
              </h2>
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="bg-coral-500 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong>Check your email</strong> for your Caregiver Starter Kit
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-coral-500 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong>Get early access</strong> when we launch in early 2024
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-coral-500 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong>Shape the platform</strong> with your feedback and ideas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-neutral-700 dark:text-white mb-4">
              Know other caregivers who need support?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-8">
              Help us build a stronger community by sharing with friends, family, or colleagues.
            </p>
            
            {/* Suspense wrapper for client component */}
            <Suspense fallback={
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" disabled>
                  <Twitter className="mr-2 h-5 w-5" />
                  Share on X
                </Button>
                <Button variant="outline" size="lg" disabled>
                  <Linkedin className="mr-2 h-5 w-5" />
                  Share on LinkedIn
                </Button>
              </div>
            }>
              <SuccessPageClient />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Top Resources */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-700 dark:text-white mb-4">
                While you wait, explore our top resources
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300">
                Start your caregiving journey with these helpful guides.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {topResources.map((resource, index) => (
                <div key={index} className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-6 hover:shadow-xl transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-coral-100 text-coral-800 dark:bg-coral-900/30 dark:text-coral-300">
                      {resource.category}
                    </span>
                    <BookOpen className="h-5 w-5 text-coral-500 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-2 group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
                    {resource.description}
                  </p>
                  <Button variant="ghost" size="sm" asChild className="text-coral-600 hover:text-coral-700 dark:text-coral-400 dark:hover:text-coral-300 p-0 h-auto font-medium">
                    <Link href={resource.href} className="inline-flex items-center">
                      Read more
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Heart className="h-12 w-12 text-coral-500 mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-neutral-700 dark:text-white mb-4">
              Questions? We're here to help
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-8">
              Reach out anytime if you have questions about Support Network or need immediate resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/resources">
                  Browse resources
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  Contact us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}