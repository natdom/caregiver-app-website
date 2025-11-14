import type { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Join us in building support for 53M+ family caregivers who need better tools and community.',
  openGraph: {
    title: 'Partners - withCare',
    description:
      'Join us in building support for 53M+ family caregivers who need better tools and community.',
    type: 'website',
  },
}

const problemData = [
  {
    text: 'Family caregivers provide $600B+ in unpaid care annually, yet 61% report high emotional stress.',
    source: {
      title: 'AARP Public Policy Institute',
      url: 'https://www.aarp.org/ppi/info-2020/valuing-the-invaluable-2019-update.html',
      date: '2020',
    },
  },
  {
    text: 'Healthcare systems lose $13.4B yearly due to caregiver-related employee absenteeism and turnover.',
    source: {
      title: 'Harvard Business Review',
      url: 'https://hbr.org/2019/11/the-caring-company',
      date: '2019',
    },
  },
  {
    text: '89% of caregivers want peer support, but only 23% have access to structured community resources.',
    source: {
      title: 'National Alliance for Caregiving',
      url: 'https://www.caregiving.org/research/caregiver-statistics-demographics/',
      date: '2022',
    },
  },
]

export default function PartnersPage() {
  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Hero Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl lg:text-6xl">
              Help us build for{' '}
              <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent">
                53M+ caregivers
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-neutral-600 dark:text-neutral-300">
              We're in the early stages of building a platform to support
              family caregivers. The problem is massive, and we need partners
              who believe in this mission.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-neutral-700 dark:text-white">
              The problem
            </h2>
            <div className="space-y-8">
              {problemData.map((problem, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                >
                  <p className="mb-3 text-lg text-neutral-700 dark:text-neutral-300">
                    {problem.text}
                  </p>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    <Link
                      href={problem.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 transition-colors hover:text-coral-600 dark:hover:text-coral-400"
                    >
                      {problem.source.title}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    {' • '}
                    {problem.source.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-neutral-700 dark:text-white">
              What we're building
            </h2>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <p className="mb-6 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                A platform where caregivers of all kinds can find community, access
                curated resources, and get the support they desperately need.
              </p>
              <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                We're starting small, focusing on building something caregivers
                actually want. We believe in listening to this community first,
                then scaling what works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-neutral-700 dark:text-white">
              Interested in partnering?
            </h2>
            <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-300">
              We're looking for partners who understand the caregiving space
              and want to help us build something meaningful.
            </p>
            <p className="text-neutral-600 dark:text-neutral-300">
              Reach out at{' '}
              <Link
                href="mailto:hello@withcare.app"
                className="text-coral-600 hover:text-coral-700 dark:text-coral-400 dark:hover:text-coral-300"
              >
                hello@withcare.app
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
