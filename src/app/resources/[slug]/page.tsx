import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allResources } from 'contentlayer/generated'
import { ResourcePageClient } from './resource-page-client'

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

  return <ResourcePageClient resource={resource} />
}

