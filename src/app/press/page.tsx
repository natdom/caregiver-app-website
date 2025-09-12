import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Mail, Users, TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Press Kit',
  description: 'Press information, market context, and contact details for Support Network.',
}

const marketStats = [
  {
    stat: '53.4 million',
    description: 'Family caregivers in the US',
    source: 'AARP Public Policy Institute, 2020'
  },
  {
    stat: '61%',
    description: 'Report high levels of emotional stress',
    source: 'National Alliance for Caregiving, 2020'
  },
  {
    stat: '$470 billion',
    description: 'Annual economic value of unpaid family caregiving',
    source: 'AARP Public Policy Institute, 2019'
  },
  {
    stat: '24/7',
    description: 'Average hours per week spent caregiving',
    source: 'AARP & National Alliance for Caregiving, 2020'
  }
]

const tractionSignals = [
  'Growing waitlist interest from diverse caregiver demographics',
  'Advisory network forming with caregiving experts and advocates',
  'Partner discussions underway with healthcare organizations',
  'Content strategy validated through early community feedback',
  'Technical foundation built for scalable community platform'
]

export default function PressPage() {
  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Header */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl">
              Press Kit
            </h1>
            <p className="mt-6 text-xl leading-8 text-neutral-600 dark:text-neutral-300">
              Building the support network that millions of caregivers need and deserve.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8 sm:p-12">
              <h2 className="text-3xl font-bold text-neutral-700 dark:text-white mb-6">
                The problem we're solving
              </h2>
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <p>
                  Millions of Americans provide unpaid care to family members with chronic conditions, 
                  disabilities, or age-related needs. Despite the scale of family caregiving, most 
                  caregivers feel isolated, overwhelmed, and unsupported.
                </p>
                <p>
                  Existing resources are fragmented, clinical, or difficult to navigate. Caregivers 
                  need a centralized, empathetic community where they can find practical guidance 
                  and genuine support from others who understand their unique challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Context */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-neutral-700 dark:text-white mb-12">
              Market context
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {marketStats.map((item, index) => (
                <div key={index} className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-6 text-center">
                  <div className="text-3xl font-bold text-coral-600 dark:text-coral-400 mb-2">
                    {item.stat}
                  </div>
                  <div className="text-neutral-700 dark:text-white font-medium mb-2">
                    {item.description}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-coral-50 to-sage-50 dark:from-coral-900/20 dark:to-sage-900/20 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl font-bold text-neutral-700 dark:text-white mb-6">
                Our solution
              </h2>
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-8">
                <p>
                  Support Network is a comprehensive platform designed specifically for family caregivers. 
                  We provide three core pillars of support:
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <Users className="h-8 w-8 text-coral-600 dark:text-coral-400 mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-2">
                    Connection
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Find people who truly understand your caregiving journey and challenges.
                  </p>
                </div>
                <div>
                  <Target className="h-8 w-8 text-coral-600 dark:text-coral-400 mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-2">
                    Clarity
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Practical, actionable guidance without overwhelming complexity or clinical jargon.
                  </p>
                </div>
                <div>
                  <TrendingUp className="h-8 w-8 text-coral-600 dark:text-coral-400 mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-2">
                    Care
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Tools and resources that respect your time and emotional bandwidth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8 sm:p-12">
              <h2 className="text-3xl font-bold text-neutral-700 dark:text-white mb-6">
                Early traction signals
              </h2>
              <ul className="space-y-4">
                {tractionSignals.map((signal, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2 mr-4"></div>
                    <span className="text-neutral-600 dark:text-neutral-300">{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-neutral-700 dark:text-white mb-6">
              Get in touch
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
              For media inquiries, partnership opportunities, or investment discussions.
            </p>
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8">
              <div className="flex items-center justify-center mb-6">
                <Mail className="h-12 w-12 text-teal-500" />
              </div>
              <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                <div className="font-medium">Press Contact</div>
                <div>
                  <a href="mailto:hello@support.network" className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                    hello@support.network
                  </a>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                <Button asChild>
                  <Link href="/contact">
                    Send a message
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}