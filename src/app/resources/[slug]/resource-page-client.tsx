'use client'

import { getMDXComponent } from 'next-contentlayer/hooks'
import { useMDXComponents } from '@/mdx-components'
import { formatDate } from '@/lib/utils'
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StarterKitCTA } from '@/components/starter-kit-cta'
import { ArticleSchema } from '@/components/article-schema'
import { useScrollTracking } from '@/hooks/use-scroll-tracking'

interface ResourcePageClientProps {
  resource: any
}

export function ResourcePageClient({ resource }: ResourcePageClientProps) {
  const MDXContent = getMDXComponent(resource.body.code)
  const components = useMDXComponents({})

  // Track scroll progress and 50% milestone
  useScrollTracking({
    onScrollProgress: (progress) => {
      // Could add a progress bar here in the future
    }
  })

  return (
    <>
      <ArticleSchema resource={resource} />
      <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 min-h-screen">
        <article className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              {/* Back button */}
              <div className="mb-8">
                <Button variant="ghost" asChild>
                  <Link href="/resources">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to resources
                  </Link>
                </Button>
              </div>

              {/* Header */}
              <header className="mb-12">
                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {resource.topics.map((topic: string) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900 px-3 py-1 text-xs font-medium text-teal-800 dark:text-teal-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                
                {/* Cover image */}
                {resource.cover && (
                  <div className="mb-8 -mx-4 sm:mx-0">
                    <img
                      src={resource.cover}
                      alt={resource.coverAlt || resource.title}
                      className="w-full h-64 sm:h-80 object-cover rounded-none sm:rounded-2xl shadow-lg"
                    />
                  </div>
                )}
                
                <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl mb-6 leading-tight">
                  {resource.title}
                </h1>
                
                <p className="text-xl leading-8 text-neutral-600 dark:text-neutral-200 mb-8 font-medium">
                  {resource.excerpt}
                </p>

                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700 pb-8">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{resource.author}</span>
                    {resource.authorRole && (
                      <span className="ml-1">({resource.authorRole})</span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(resource.publishedAt)}</span>
                  </div>
                  
                  {resource.readingTime && (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{resource.readingTime} min read</span>
                    </div>
                  )}
                </div>
              </header>

              {/* Content */}
              <div className="max-w-none">
                <MDXContent components={components} />
              </div>

              {/* Footer */}
              <div className="mt-12">
                <StarterKitCTA />
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}