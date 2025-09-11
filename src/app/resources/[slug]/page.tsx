import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allResources } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
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

  return (
    <div className="bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 dark:from-slate-900 dark:via-sky-900 dark:to-slate-900 min-h-screen">
      <article className="py-16">
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
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                {resource.topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center rounded-full bg-sky-100 dark:bg-sky-900 px-3 py-1 text-xs font-medium text-sky-800 dark:text-sky-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
                {resource.title}
              </h1>
              
              <p className="text-xl leading-8 text-slate-600 dark:text-slate-300 mb-8">
                {resource.excerpt}
              </p>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-8">
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
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <MDXContent />
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Was this helpful?
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Join our community to get more resources like this and connect with other caregivers.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild>
                    <Link href="/newsletter">Join our waitlist</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/resources">Explore more resources</Link>
                  </Button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  )
}