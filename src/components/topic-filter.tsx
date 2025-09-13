'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TopicHub {
  id: string
  name: string
  description: string
  color: string
  keywords: string[] // Topics that map to this hub
}

export const topicHubs: TopicHub[] = [
  {
    id: 'dementia',
    name: 'Dementia Care',
    description: 'Resources for caring for someone with dementia or Alzheimer\'s',
    color: 'from-purple-500 to-purple-600',
    keywords: ['Dementia', 'Alzheimer', 'Memory', 'Cognitive']
  },
  {
    id: 'neurodiversity',
    name: 'Neurodiversity',
    description: 'Support for autism, ADHD, and other neurological differences',
    color: 'from-blue-500 to-blue-600',
    keywords: ['Autism', 'ADHD', 'Neurodiversity', 'Special Needs']
  },
  {
    id: 'care-coordination',
    name: 'Care Coordination',
    description: 'Managing healthcare, appointments, and communication',
    color: 'from-teal-500 to-teal-600',
    keywords: ['Healthcare', 'Communication', 'Organization', 'Planning', 'Advocacy']
  },
  {
    id: 'self-care',
    name: 'Self-Care',
    description: 'Taking care of yourself while caring for others',
    color: 'from-coral-500 to-coral-600',
    keywords: ['Self-Care', 'Mental Health', 'Burnout Prevention', 'Wellness', 'Support']
  },
  {
    id: 'mobility',
    name: 'Mobility & Safety',
    description: 'Home safety, mobility aids, and accessibility',
    color: 'from-sage-500 to-sage-600',
    keywords: ['Safety', 'Mobility', 'Accessibility', 'Home Modifications', 'Emergency Planning', 'Preparedness']
  }
]

interface TopicFilterProps {
  selectedTopics: string[]
  onTopicsChange: (topics: string[]) => void
  className?: string
}

export function TopicFilter({ selectedTopics, onTopicsChange, className }: TopicFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleTopicToggle = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      onTopicsChange(selectedTopics.filter(t => t !== topicId))
    } else {
      onTopicsChange([...selectedTopics, topicId])
    }

    // Track filter usage
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('topic_filter_used', {
        props: { 
          topic: topicId,
          action: selectedTopics.includes(topicId) ? 'remove' : 'add'
        }
      })
    }
  }

  const clearAllFilters = () => {
    onTopicsChange([])
    
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('topic_filter_cleared')
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected filters display */}
      {selectedTopics.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Filtered by:
          </span>
          {selectedTopics.map(topicId => {
            const hub = topicHubs.find(h => h.id === topicId)
            if (!hub) return null
            
            return (
              <button
                key={topicId}
                onClick={() => handleTopicToggle(topicId)}
                className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900 px-3 py-1 text-sm font-medium text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
              >
                {hub.name}
                <X className="ml-1 h-3 w-3" />
              </button>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Topic hub buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-white">
            Browse by Topic
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm"
          >
            {isExpanded ? 'Show less' : 'Show all'}
          </Button>
        </div>
        
        <div className={cn(
          "grid gap-3",
          isExpanded ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        )}>
          {topicHubs.map(hub => (
            <Button
              key={hub.id}
              variant={selectedTopics.includes(hub.id) ? "default" : "outline"}
              onClick={() => handleTopicToggle(hub.id)}
              className={cn(
                "justify-start text-left h-auto p-4 transition-all",
                selectedTopics.includes(hub.id) 
                  ? `bg-gradient-to-r ${hub.color} text-white border-none hover:opacity-90` 
                  : "hover:border-teal-300 dark:hover:border-teal-600",
                isExpanded ? "flex-col items-start space-y-1" : ""
              )}
            >
              <div className="font-semibold">{hub.name}</div>
              {isExpanded && (
                <div className="text-xs opacity-80 leading-tight">
                  {hub.description}
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}