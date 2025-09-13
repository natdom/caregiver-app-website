'use client'

import { useState } from 'react'
import type { Resource } from 'contentlayer/generated'
import { ResourceCard } from '@/components/resource-card'
import { NewsletterInline } from '@/components/newsletter-inline'
import { TopicFilter } from '@/components/topic-filter'
import { filterResourcesByTopicHubs, getMostSavedResources } from '@/lib/topic-utils'
import { Star } from 'lucide-react'

interface ResourcesPageClientProps {
  resources: Resource[]
}

export function ResourcesPageClient({ resources }: ResourcesPageClientProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  
  // Filter resources based on selected topics
  const filteredResources = filterResourcesByTopicHubs(resources, selectedTopics)
  const featuredResources = filteredResources.filter(resource => resource.featured)
  const otherResources = filteredResources.filter(resource => !resource.featured)
  const mostSavedResources = getMostSavedResources(resources)

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

      {/* Newsletter Signup */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <NewsletterInline source="resources_index" />
          </div>
        </div>
      </section>

      {/* Topic Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TopicFilter 
            selectedTopics={selectedTopics}
            onTopicsChange={setSelectedTopics}
          />
        </div>
      </section>

      {/* Most Saved Resources - only show when no filters applied */}
      {selectedTopics.length === 0 && mostSavedResources.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Star className="h-6 w-6 text-coral-500 dark:text-coral-400 fill-current" />
              <h2 className="text-2xl font-bold text-neutral-700 dark:text-white">
                Most-Saved Resources
              </h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {mostSavedResources.map((resource) => (
                <div key={resource._id} className="relative">
                  <ResourceCard
                    resource={resource}
                    featured={true}
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-coral-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Most-saved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-700 dark:text-white mb-8">
              {selectedTopics.length > 0 ? 'Featured in your topics' : 'Featured Resources'}
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
            {featuredResources.length > 0 
              ? (selectedTopics.length > 0 ? 'More in your topics' : 'More Resources')
              : (selectedTopics.length > 0 ? 'Resources in your topics' : 'All Resources')
            }
          </h2>
          
          {otherResources.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {otherResources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  featured={false}
                />
              ))}
            </div>
          ) : selectedTopics.length > 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-500 dark:text-neutral-400 text-lg">
                No resources found for the selected topics.
              </div>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-2">
                Try selecting different topics or clearing your filters.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}