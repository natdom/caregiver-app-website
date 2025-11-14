import { allResources } from '@/lib/contentlayer-shim'
import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeaturedResourceProps {
  className?: string
  limit?: number
}

export function FeaturedResources({
  className,
  limit = 3,
}: FeaturedResourceProps) {
  // Get top 3 resources (featured first, then by publication date)
  const topResources = allResources
    .sort((a, b) => {
      // Featured resources first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      // Then by publication date
      return compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
    })
    .slice(0, limit)

  const getResourceDescription = (resource: any) => {
    const descriptions: Record<string, string> = {
      'starting-a-care-log':
        'Learn what information to track and organize for better medical appointments and care coordination',
      'self-care-strategies':
        'Discover practical ways to maintain your wellbeing while caring for others',
      'medical-appointments-less-stressful':
        'Get proven strategies to prepare for and navigate healthcare visits with confidence',
    }
    return descriptions[resource.slug] || resource.excerpt
  }

  if (topResources.length === 0) {
    return null
  }

  return (
    <section
      className={cn(
        'bg-gradient-to-r from-sage-50 to-coral-50 py-16 dark:from-sage-900/20 dark:to-coral-900/20 sm:py-24',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center">
            <BookOpen className="mr-3 h-8 w-8 text-teal-600 dark:text-teal-400" />
            <h2 className="text-3xl font-bold text-neutral-700 dark:text-white sm:text-4xl">
              Start With These Guides
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-200">
            Helpful, judgment-free resources to help you feel more confident,
            supported, and organized—one small step at a time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {topResources.map((resource, index) => (
            <article
              key={resource._id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
            >
              {resource.cover && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={resource.cover}
                    alt={resource.coverAlt || resource.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  {resource.topics?.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <h3 className="mb-3 text-xl font-semibold leading-tight text-neutral-700 dark:text-white">
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {resource.title}
                  </Link>
                </h3>

                <p className="mb-4 leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {getResourceDescription(resource)}
                </p>

                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    By {resource.author}
                  </div>
                  {resource.readingTime && (
                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                      <Clock className="mr-1 h-4 w-4" />
                      {resource.readingTime} min read
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" className="group w-full">
                  <Link href={`/resources/${resource.slug}`}>
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/resources">Browse all resources →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
