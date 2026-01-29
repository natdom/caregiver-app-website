import { allResources } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeaturedResourceProps {
  className?: string
}

const summaries: Record<string, string> = {
  'starting-a-care-log': 'What to track for better appointments and coordination.',
  'self-care-strategies': 'Practical ways to maintain your wellbeing while caregiving.',
  'medical-appointments-less-stressful': 'Strategies to navigate healthcare visits with confidence.',
  'unspoken-grief-watching-someone-fade': 'Understanding the grief that begins before goodbye.',
  'stay-connected-when-illness-changes-everything': 'Maintaining closeness when everything changes.',
  'when-parent-becomes-one-who-needs-you': 'Navigating the role reversal with love and grace.',
  'when-childs-needs-redefine-your-life': 'Finding strength in an unexpected journey.',
}

export function FeaturedResources({ className }: FeaturedResourceProps) {
  const featuredResources = allResources
    .filter(r => r.featured)
    .sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)))
    .slice(0, 4)

  if (featuredResources.length === 0) {
    return null
  }

  const getSummary = (slug: string, fallback: string) => {
    return summaries[slug] || fallback.slice(0, 80) + '...'
  }

  return (
    <section
      className={cn(
        'bg-stone-100 py-16 dark:bg-neutral-900 sm:py-20',
        className
      )}
    >
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-neutral-700 dark:text-white sm:text-3xl">
            Guides and Insights
          </h2>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Guides to support your caregiving journey
          </p>
        </div>

        <div className="space-y-2">
          {featuredResources.map((resource) => (
            <Link
              key={resource._id}
              href={`/resources/${resource.slug}`}
              className="group flex items-center justify-between rounded-xl bg-white/60 p-4 transition-all hover:bg-white dark:bg-white/10 dark:hover:bg-white/15"
            >
              <div>
                <h3 className="font-medium text-neutral-800 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
                  {resource.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {getSummary(resource.slug, resource.excerpt)}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 flex-shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/resources"
            className="inline-flex items-center text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Explore all guides
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
