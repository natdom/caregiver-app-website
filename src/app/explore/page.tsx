import type { Metadata } from 'next'
import { allResources } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import { ResourcesPageClient } from './resources-client'

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Practical guides and insights for caregivers, written by experts and people who understand your journey.',
}

export default function ResourcesPage() {
  const resources = allResources.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  )

  return <ResourcesPageClient resources={resources} />
}