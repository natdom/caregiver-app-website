import { topicHubs, type TopicHub } from '@/components/topic-filter'
import type { Resource } from 'contentlayer/generated'

export function getResourceTopicHubs(resource: Resource): TopicHub[] {
  const resourceTopics = resource.topics || []
  
  return topicHubs.filter(hub => 
    hub.keywords.some(keyword => 
      resourceTopics.some(topic => 
        topic.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(topic.toLowerCase())
      )
    )
  )
}

export function filterResourcesByTopicHubs(resources: Resource[], selectedHubIds: string[]): Resource[] {
  if (selectedHubIds.length === 0) {
    return resources
  }
  
  return resources.filter(resource => {
    const resourceHubs = getResourceTopicHubs(resource)
    return resourceHubs.some(hub => selectedHubIds.includes(hub.id))
  })
}

export function getTopicHubStats(resources: Resource[]) {
  const stats: Record<string, number> = {}
  
  topicHubs.forEach(hub => {
    stats[hub.id] = resources.filter(resource => 
      getResourceTopicHubs(resource).some(h => h.id === hub.id)
    ).length
  })
  
  return stats
}

export function getMostSavedResources(resources: Resource[]): Resource[] {
  // For now, we'll simulate "most saved" by returning featured resources
  // In a real app, this would query actual save/bookmark data
  return resources.filter(resource => resource.featured)
}