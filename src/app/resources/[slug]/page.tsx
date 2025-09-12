import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allResources } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { useMDXComponents } from '@/mdx-components'
import { formatDate } from '@/lib/utils'
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ResourcePageProps {
  params: {
    slug: string
  }
}

async function getResourceFromParams(params: ResourcePageProps['params']) {
  const slug = params?.slug
  const resource = allResources.find(
    (resource) => resource.slug === slug
  )

  if (!resource) {
    return null
  }

  return resource
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const resource = await getResourceFromParams(params)

  if (!resource) {
    return {}
  }

  return {
    title: resource.title,
    description: resource.excerpt,
    authors: [{ name: resource.author }],
    openGraph: {
      title: resource.title,
      description: resource.excerpt,
      type: 'article',
      publishedTime: resource.publishedAt,
      modifiedTime: resource.updatedAt || resource.publishedAt,
      authors: [resource.author],
      images: resource.cover ? [
        {
          url: resource.cover,
          alt: resource.coverAlt || resource.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description: resource.excerpt,
      images: resource.cover ? [resource.cover] : [],
    },
  }
}

export async function generateStaticParams(): Promise<
  ResourcePageProps['params'][]
> {
  return allResources.map((resource) => ({
    slug: resource.slug,
  }))
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resource = await getResourceFromParams(params)

  if (!resource) {
    notFound()
  }

  const MDXContent = getMDXComponent(resource.body.code)
  const components = useMDXComponents({})

  return (
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
                {resource.topics.map((topic) => (
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
            {/* Related articles suggestion */}
            <div className="mt-12 p-6 bg-gradient-to-r from-coral-50 to-sage-50 dark:from-coral-900/20 dark:to-sage-900/20 rounded-2xl border border-coral-200 dark:border-coral-800">
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-3">
                💡 Found this helpful?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-200 mb-4">
                Join our community to get more practical caregiving resources and connect with others who understand your journey.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="sm" className="font-medium">
                  <Link href="/newsletter">Join our waitlist</Link>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <Link href="/resources">Browse more resources</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}