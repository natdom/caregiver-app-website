'use client'

import { useState, useMemo } from 'react'
import type { Resource } from 'contentlayer/generated'
import Link from 'next/link'
import { Search, ArrowRight, Clock, BookOpen, Heart, Sparkles } from 'lucide-react'
import { NewsletterInline } from '@/components/newsletter-inline'

interface ResourcesPageClientProps {
  resources: Resource[]
}

// Quick access cards for common situations
const quickAccess = [
  {
    id: 'new',
    label: 'New to caregiving?',
    description: 'Start here',
    icon: Sparkles,
    slug: 'starting-a-care-log',
  },
  {
    id: 'overwhelmed',
    label: 'Feeling overwhelmed?',
    description: 'Self-care that works',
    icon: Heart,
    slug: 'self-care-strategies',
  },
  {
    id: 'medical',
    label: 'Managing appointments?',
    description: 'Navigate with confidence',
    icon: BookOpen,
    slug: 'medical-appointments-less-stressful',
  },
]

// Define thematic sections
const themeSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Essential guides for new caregivers',
    slugs: ['starting-a-care-log', 'finding-local-support'],
  },
  {
    id: 'medical-care',
    title: 'Managing Medical Care',
    description: 'Navigate healthcare with confidence',
    slugs: ['medical-appointments-less-stressful', 'emergency-preparedness', 'technology-tools'],
  },
  {
    id: 'emotional-support',
    title: 'Emotional Support',
    description: 'Understanding the emotional journey',
    slugs: ['unspoken-grief-watching-someone-fade', 'stay-connected-when-illness-changes-everything'],
  },
  {
    id: 'your-journey',
    title: 'Your Caregiving Journey',
    description: 'Guides for specific situations',
    slugs: ['when-parent-becomes-one-who-needs-you', 'when-childs-needs-redefine-your-life'],
  },
  {
    id: 'self-care',
    title: 'Taking Care of Yourself',
    description: 'You matter too',
    slugs: ['self-care-strategies'],
  },
]

export function ResourcesPageClient({ resources }: ResourcesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Get resource by slug
  const getResourceBySlug = (slug: string) => resources.find(r => r.slug === slug)

  // Get resources for a section
  const getResourcesForSection = (slugs: string[]) => {
    return slugs
      .map(slug => resources.find(r => r.slug === slug))
      .filter(Boolean) as Resource[]
  }

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery) return []
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [resources, searchQuery])

  // Featured resources
  const featuredResources = resources.filter(r => r.featured).slice(0, 3)

  const isSearching = searchQuery.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Header */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl">
              Guides and Insights
            </h1>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
              Practical resources written by caregivers, for caregivers.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="What do you need help with today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-700 placeholder-neutral-400 shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {isSearching ? (
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-lg font-semibold text-neutral-700 dark:text-white">
                Results for "{searchQuery}"
                <span className="ml-2 text-sm font-normal text-neutral-500">
                  ({searchResults.length})
                </span>
              </h2>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((resource) => (
                    <Link
                      key={resource._id}
                      href={resource.url}
                      className="group flex items-center justify-between rounded-lg bg-white/50 px-4 py-3 transition-all hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-neutral-700 group-hover:text-teal-600 dark:text-neutral-200 dark:group-hover:text-teal-400">
                          {resource.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="flex items-center text-xs text-neutral-400">
                            <Clock className="mr-1 h-3 w-3" />
                            {resource.readingTime || 5} min read
                          </span>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {resource.excerpt.slice(0, 60)}...
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="ml-4 h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400">
                  No guides found. Try a different search term.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Quick Access Cards */}
          <section className="py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl">
                <div className="grid gap-3 sm:grid-cols-3">
                  {quickAccess.map((item) => {
                    const resource = getResourceBySlug(item.slug)
                    if (!resource) return null
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.id}
                        href={resource.url}
                        className="group flex items-center gap-3 rounded-xl border border-white/60 bg-white/40 p-4 transition-all hover:border-teal-200 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-800 dark:hover:bg-white/10"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100/80 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-700 group-hover:text-teal-600 dark:text-neutral-200 dark:group-hover:text-teal-400">
                            {item.label}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Featured */}
          {featuredResources.length > 0 && (
            <section className="py-6">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Popular Guides
                  </h2>
                  <div className="space-y-2">
                    {featuredResources.map((resource) => (
                      <Link
                        key={resource._id}
                        href={resource.url}
                        className="group flex items-center justify-between rounded-xl bg-white/60 p-4 transition-all hover:bg-white/80 hover:shadow-sm dark:bg-white/10 dark:hover:bg-white/15"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-neutral-800 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
                            {resource.title}
                          </h3>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center text-xs text-neutral-400">
                              <Clock className="mr-1 h-3 w-3" />
                              {resource.readingTime || 5} min read
                            </span>
                            <span className="hidden text-sm text-neutral-500 dark:text-neutral-400 sm:inline">
                              {resource.excerpt.slice(0, 60)}...
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="ml-4 h-5 w-5 flex-shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Thematic Sections */}
          <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl space-y-10">
                {themeSections.map((section) => {
                  const sectionResources = getResourcesForSection(section.slugs)
                  if (sectionResources.length === 0) return null

                  const isExpanded = expandedSection === section.id
                  const displayResources = isExpanded ? sectionResources : sectionResources.slice(0, 3)

                  return (
                    <div key={section.id}>
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-neutral-700 dark:text-white">
                          {section.title}
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          {section.description}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {displayResources.map((resource) => (
                          <Link
                            key={resource._id}
                            href={resource.url}
                            className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all hover:bg-white/60 dark:hover:bg-white/10"
                          >
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-neutral-700 group-hover:text-teal-600 dark:text-neutral-200 dark:group-hover:text-teal-400">
                                {resource.title}
                              </h3>
                            </div>
                            <div className="ml-4 flex items-center gap-3">
                              <span className="hidden text-xs text-neutral-400 sm:flex sm:items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {resource.readingTime || 5} min
                              </span>
                              <ArrowRight className="h-4 w-4 flex-shrink-0 text-neutral-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      {sectionResources.length > 3 && !isExpanded && (
                        <button
                          onClick={() => setExpandedSection(section.id)}
                          className="mt-2 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                          See all {sectionResources.length} →
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Newsletter CTA */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <NewsletterInline source="explore_page" />
          </div>
        </div>
      </section>
    </div>
  )
}
