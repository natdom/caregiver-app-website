import type { Metadata } from 'next'
import { Users, Heart, Target, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Support Network\'s mission to make every caregiver\'s day a little lighter through connection, clarity, and care.',
}

const values = [
  {
    icon: Heart,
    title: 'Empathy First',
    description: 'We lead with understanding. Every feature, resource, and interaction is designed with the caregiver\'s emotional and practical needs in mind.',
  },
  {
    icon: Users,
    title: 'Community-Centered',
    description: 'Real support comes from people who understand your journey. We facilitate authentic connections between caregivers.',
  },
  {
    icon: Target,
    title: 'Practical Focus',
    description: 'No fluff, no platitudes. We provide actionable guidance that fits into your real-world caregiving situation.',
  },
  {
    icon: Clock,
    title: 'Respect for Time',
    description: 'Caregivers are busy. Our resources are designed to be quickly consumable and immediately useful.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl">
              Why Support Network exists
            </h1>
            <p className="mt-6 text-xl leading-8 text-neutral-600 dark:text-neutral-200">
              Caregiving touches millions of lives, yet too many caregivers feel isolated, overwhelmed, 
              and unsupported. We're here to change that.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8 sm:p-12">
              <h2 className="text-3xl font-bold text-neutral-700 dark:text-white mb-6">
                Our mission
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-200 leading-relaxed mb-8">
                To make every caregiver's day a little lighter through connection, clarity, and care.
              </p>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-4">
                    Who we serve
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-200">
                    <li>• Parents of neurodivergent children</li>
                    <li>• Adult children supporting aging parents</li>
                    <li>• Spouses managing chronic conditions</li>
                    <li>• Anyone navigating complex care needs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-4">
                    What makes us different
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-200">
                    <li>• Judgment-free community space</li>
                    <li>• Practical, actionable resources</li>
                    <li>• Designed by and for caregivers</li>
                    <li>• Focus on reducing mental load</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
              Our values guide everything we build
            </h2>
          </div>
          
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8 hover:shadow-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-coral-100 dark:bg-coral-900 mb-6">
                    <value.icon className="h-6 w-6 text-coral-600 dark:text-coral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-200 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-coral-50/50 to-sage-50/50 dark:from-coral-900/10 dark:to-sage-900/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8 sm:p-12">
              <h2 className="text-3xl font-bold text-neutral-700 dark:text-white mb-6">
                What we're building
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-3">
                    Phase 1: Foundation (2024)
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-200 ml-4">
                    <li>• Curated resource library with practical caregiving guides</li>
                    <li>• Community waitlist and early feedback collection</li>
                    <li>• Brand presence and partnership network development</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-3">
                    Phase 2: Community (2025)
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-200 ml-4">
                    <li>• Launched community platform with focused discussion areas</li>
                    <li>• Peer-to-peer support and resource sharing</li>
                    <li>• Expert-moderated Q&A sessions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-3">
                    Phase 3: Tools (2025-2026)
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-200 ml-4">
                    <li>• Care coordination tools and templates</li>
                    <li>• Personalized resource recommendations</li>
                    <li>• Integration with local services and providers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}