import type { Metadata } from 'next'
import { allResources } from 'contentlayer/generated'
import { ResourceCard } from '@/components/resource-card'
import { compareDesc } from 'date-fns'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Practical guides and resources for caregivers, written by experts and people who understand your journey.',
}

export default function ResourcesPage() {
  const resources = allResources.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  )

  const featuredResources = resources.filter(resource => resource.featured)
  const otherResources = resources.filter(resource => !resource.featured)

  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 min-h-screen">
      {/* Header */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl">
              Caregiving Resources
            </h1>
            <p className="mt-6 text-xl leading-8 text-neutral-600 dark:text-neutral-200">
              Practical guides and insights from caregiving experts and people who understand your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-700 dark:text-white mb-8">
              Featured Resources
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {featuredResources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  featured={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Resources */}
      <section className="py-8 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-700 dark:text-white mb-8">
            {featuredResources.length > 0 ? 'More Resources' : 'All Resources'}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {otherResources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                featured={false}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}