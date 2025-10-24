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
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="mb-4 text-2xl font-bold text-neutral-700 dark:text-white">
                  What we're building
                </h3>
                <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-300">
                  withCare is more than a platform—it's a movement to make
                  caregiving feel lighter. We're creating a supportive space
                  built on connection, ease, and growth.
                </p>
                <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                  <li>
                    • Curated resources from trusted experts and caregivers
                  </li>
                  <li>
                    • A welcoming community for open, judgment-free
                    conversations
                  </li>
                  <li>
                    • Practical tools that simplify complex care challenges
                  </li>
                  <li>
                    • A focus on mental and emotional wellbeing, not just
                    logistics
                  </li>
                </ul>
              </div>
              <div className="text-center lg:text-right">
                <div className="inline-flex flex-col items-center space-y-4 lg:items-end">
                  <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Early traction signals
                  </div>
                  <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <div>Growing waitlist interest</div>
                    <div>Advisory network forming</div>
                    <div>Partner discussions underway</div>
                  </div>
                  <Button asChild className="mt-6">
                    <Link href="/press">See where we're headed →</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
