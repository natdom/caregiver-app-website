import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Users, Target } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '53.4M',
    label: 'Family caregivers in the US',
    source: 'AARP, 2020',
  },
  {
    icon: TrendingUp,
    value: '61%',
    label: 'Report feeling overwhelmed',
    source: 'NAC/AARP, 2020',
  },
  {
    icon: Target,
    value: '$470B',
    label: 'Annual economic value of unpaid care',
    source: 'AARP, 2019',
  },
]

export function FundingSnapshot() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-6">
              The opportunity is clear
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Millions of caregivers need better support. We're building the platform to help them thrive.
            </p>
          </div>

          {/* Market stats */}
          <div className="grid gap-8 sm:grid-cols-3 mb-16">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 mb-4 mx-auto">
                  <stat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.source}
                </div>
              </div>
            ))}
          </div>

          {/* What we're building */}
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20 rounded-2xl p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  What we're building
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  Support Network reduces the mental load of caregiving through judgment-free information, 
                  a caring community, and simple tools that make each day a little easier.
                </p>
                <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                  <li>• Curated resources from trusted caregiving experts</li>
                  <li>• Supportive community organized by care focus areas</li>
                  <li>• Practical tools for daily caregiving challenges</li>
                  <li>• Evidence-based guidance without overwhelming complexity</li>
                </ul>
              </div>
              <div className="text-center lg:text-right">
                <div className="inline-flex flex-col items-center lg:items-end space-y-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Early traction signals
                  </div>
                  <div className="space-y-2 text-slate-600 dark:text-slate-300">
                    <div>Growing waitlist interest</div>
                    <div>Advisory network forming</div>
                    <div>Partner discussions underway</div>
                  </div>
                  <Button asChild className="mt-6">
                    <Link href="/press">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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