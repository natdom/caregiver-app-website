import { allResources } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeaturedResourceProps {
  className?: string
  limit?: number
}

export function FeaturedResources({ className, limit = 3 }: FeaturedResourceProps) {
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
      'starting-a-care-log': 'Learn what information to track and organize for better medical appointments and care coordination',
      'self-care-strategies': 'Discover practical ways to maintain your wellbeing while caring for others',
      'medical-appointments-less-stressful': 'Get proven strategies to prepare for and navigate healthcare visits with confidence'
    }
    return descriptions[resource.slug] || resource.excerpt
  }

  if (topResources.length === 0) {
    return null
  }

  return (
    <section className={cn(
      "py-16 sm:py-24 bg-gradient-to-r from-sage-50 to-coral-50 dark:from-sage-900/20 dark:to-coral-900/20",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-teal-600 dark:text-teal-400 mr-3" />
            <h2 className="text-3xl font-bold text-neutral-700 dark:text-white sm:text-4xl">
              Start With These Guides
            </h2>
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-200 max-w-2xl mx-auto">
            Our most helpful resources for caregivers just starting their journey or looking to get better organized.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {topResources.map((resource, index) => (
            <article 
              key={resource._id}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {resource.cover && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={resource.cover}
                    alt={resource.coverAlt || resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {resource.topics?.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900 px-3 py-1 text-xs font-medium text-teal-800 dark:text-teal-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-3 leading-tight">
                  <Link 
                    href={`/resources/${resource.slug}`}
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {resource.title}
                  </Link>
                </h3>
                
                <p className="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                  {getResourceDescription(resource)}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    By {resource.author}
                  </div>
                  {resource.readingTime && (
                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {resource.readingTime} min read
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" className="w-full group">
                  <Link href={`/resources/${resource.slug}`}>
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/resources">
              Browse All Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}