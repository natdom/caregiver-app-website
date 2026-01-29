import { allResources } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeaturedResourceProps {
  className?: string
  limit?: number
}

const summaries: Record<string, string> = {
  'starting-a-care-log': 'What to track for better appointments and coordination.',
  'self-care-strategies': 'Practical ways to maintain your wellbeing while caregiving.',
  'medical-appointments-less-stressful': 'Strategies to navigate healthcare visits with confidence.',
  'anticipatory-grief': 'Understanding the grief that begins before goodbye.',
  'staying-connected-through-illness': 'Maintaining closeness when everything changes.',
}

export function FeaturedResources({
  className,
  limit = 4,
}: FeaturedResourceProps) {
  const topResources = allResources
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
    })
    .slice(0, limit)

  if (topResources.length === 0) {
    return null
  }

  const getSummary = (slug: string, fallback: string) => {
    return summaries[slug] || fallback
  }

  return (
    <section
      className={cn(
        'bg-stone-100 pb-16 pt-8 dark:bg-neutral-900 sm:pb-20 sm:pt-10',
        className
      )}
    >
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold text-neutral-700 dark:text-white sm:text-3xl">
            Guides and Insights
          </h2>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Resources to support your caregiving journey
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {topResources.map((resource) => (
            <Link
              key={resource._id}
              href={`/resources/${resource.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-neutral-800"
            >
              {/* Image */}
              {resource.cover && (
                <div className="aspect-[3/1] overflow-hidden">
                  <img
                    src={resource.cover}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="text-sm font-semibold leading-snug text-neutral-800 dark:text-neutral-100 sm:text-base">
                    {resource.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
                    {getSummary(resource.slug, resource.excerpt)}
                  </p>
                </div>

                <div className="mt-3 flex items-center text-xs font-medium text-teal-600 dark:text-teal-400 sm:text-sm">
                  Read article
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/resources"
            className="inline-flex items-center rounded-full bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:shadow-md dark:bg-neutral-800 dark:text-neutral-200"
          >
            View all resources
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
