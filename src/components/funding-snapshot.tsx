import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Users, Target } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '53.4M+',
    label: 'Family caregivers in the U.S.',
    source: 'AARP/NAC, 2020',
  },
  {
    icon: TrendingUp,
    value: '61%',
    label: 'Report high emotional stress',
    source: 'AARP/NAC, 2020',
  },
  {
    icon: Target,
    value: '$600B+',
    label: 'Annual economic value of unpaid care',
    source: 'AARP, 2023',
  },
]

export function FundingSnapshot() {
  return (
    <section className="bg-white py-24 dark:bg-neutral-950 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
              Caregiving touches millions — but support still falls short.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
              Every day, caregivers take on the hardest work there is, often
              with little help. withCare exists to change that — creating a
              space for connection, ease, and growth through every stage of
              care.
            </p>
          </div>

          {/* Market stats */}
          <div className="mb-16 grid gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-coral-100 dark:bg-coral-900">
                  <stat.icon className="h-6 w-6 text-coral-600 dark:text-coral-400" />
                </div>
                <div className="mb-2 text-3xl font-bold text-neutral-700 dark:text-white">
                  {stat.value}
                </div>
                <div className="mb-1 font-medium text-neutral-600 dark:text-neutral-300">
                  {stat.label}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {stat.source}
                </div>
              </div>
            ))}
          </div>

          {/* What we're building */}
          <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-coral-50/50 to-sage-50/50 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:from-coral-900/10 dark:to-sage-900/10 sm:p-12">
            <div className="text-center">
              <h3 className="mb-4 text-2xl font-bold text-neutral-700 dark:text-white">
                What we're building
              </h3>
              <p className="mb-8 leading-relaxed text-neutral-600 dark:text-neutral-300">
                A supportive digital space for caregivers of all kinds — designed
                to bring connection, clarity, and practical support to everyday
                care.
              </p>
              <div className="mx-auto grid max-w-3xl gap-6 text-left sm:grid-cols-2">
                <div className="rounded-lg border border-coral-200/30 bg-white/30 p-5 backdrop-blur-sm dark:border-coral-500/20 dark:bg-white/5">
                  <div className="mb-2 font-semibold text-neutral-700 dark:text-white">
                    Curated resources
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    Practical, trustworthy caregiving information from experts and
                    experienced caregivers
                  </div>
                </div>
                <div className="rounded-lg border border-teal-200/30 bg-white/30 p-5 backdrop-blur-sm dark:border-teal-500/20 dark:bg-white/5">
                  <div className="mb-2 font-semibold text-neutral-700 dark:text-white">
                    Welcoming community
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    Open, judgment-free conversations where caregivers can share
                    and find understanding
                  </div>
                </div>
                <div className="rounded-lg border border-sage-200/30 bg-white/30 p-5 backdrop-blur-sm dark:border-sage-500/20 dark:bg-white/5">
                  <div className="mb-2 font-semibold text-neutral-700 dark:text-white">
                    Practical tools
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    Simple solutions to help manage complex care challenges
                  </div>
                </div>
                <div className="rounded-lg border border-coral-200/30 bg-white/30 p-5 backdrop-blur-sm dark:border-coral-500/20 dark:bg-white/5">
                  <div className="mb-2 font-semibold text-neutral-700 dark:text-white">
                    Wellbeing focus
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    Mental and emotional support, not just logistics
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/about">
                    Learn more about our vision <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
