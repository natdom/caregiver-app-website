import type { Metadata } from 'next'
import { WaitlistForm } from '@/components/waitlist-form'
import { getWaitlistCount } from '@/lib/actions/waitlist'
import { Users, Feather, Sprout, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description: 'Be the first to access the platform designed for family caregivers. Join thousands already building the support network we all deserve.',
  keywords: ['caregiving', 'waitlist', 'support', 'community', 'healthcare', 'family caregivers'],
  openGraph: {
    title: 'Join the withCare Waitlist',
    description: 'Be the first to access the platform designed for family caregivers. Join thousands already building the support network we all deserve.',
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

const benefits = [
  {
    icon: Users,
    title: "Connection",
    description: "Real connection starts with understanding. Find people who share your experiences and values, and feel part of a community that truly gets what caregiving means."
  },
  {
    icon: Feather,
    title: "Ease",
    description: "Simple, practical guidance that cuts through the noise. Get support that fits your life, reduces mental load, and helps you breathe a little easier."
  },
  {
    icon: Sprout,
    title: "Growth",
    description: "Caregiving changes you—and that's okay. We help you find balance, confidence, and new ways to grow through every stage of care."
  }
]

export default async function WaitlistPage() {
  const waitlistCount = await getWaitlistCount()

  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 min-h-screen overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            
            <div className="text-center mb-12 relative z-10">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl lg:text-6xl mb-8 leading-tight px-2">
                You're not alone in
                <span className="block bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent leading-normal py-2">
                  your caregiving journey
                </span>
              </h1>
              
              <p className="mx-auto max-w-5xl text-xl text-neutral-700 dark:text-neutral-200 mb-8 leading-relaxed px-6 sm:px-8 font-medium">
                withCare is launching soon with tools, community, and resources designed
                specifically for family caregivers. Be among the first to access a platform that
                makes caregiving lighter.
              </p>

              {/* Waitlist count */}
              {waitlistCount > 0 && (
                <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 dark:border-white/10">
                  <Users className="h-4 w-4 text-coral-500" aria-hidden="true" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    <strong className="text-coral-600 dark:text-coral-400">{waitlistCount.toLocaleString()}</strong> caregivers already joined
                  </span>
                </div>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
              
              {/* Left Column - Benefits */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-700 dark:text-white mb-6">
                    What you'll get access to
                  </h2>
                  <div className="space-y-6">
                    {benefits.map((benefit) => (
                      <div key={benefit.title} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <benefit.icon className="h-8 w-8 text-coral-500" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-300">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Early Access Benefits */}
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-4">
                    Early access benefits
                  </h3>
                  <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center space-x-3">
                      <ArrowRight className="h-4 w-4 text-coral-500 flex-shrink-0" aria-hidden="true" />
                      <span>First access to new features and resources</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ArrowRight className="h-4 w-4 text-coral-500 flex-shrink-0" aria-hidden="true" />
                      <span>Influence platform development with your feedback</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ArrowRight className="h-4 w-4 text-coral-500 flex-shrink-0" aria-hidden="true" />
                      <span>Free Caregiver Starter Kit (digital resources)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ArrowRight className="h-4 w-4 text-coral-500 flex-shrink-0" aria-hidden="true" />
                      <span>Connect with other early community members</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 dark:border-white/20 p-6">
                  <WaitlistForm showTitle={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}