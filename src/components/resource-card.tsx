'use client'

import Link from 'next/link'
import type { Resource } from 'contentlayer/generated'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, User } from 'lucide-react'

interface ResourceCardProps {
  resource: Resource
  featured?: boolean
}

export function ResourceCard({ resource, featured = false }: ResourceCardProps) {
  return (
    <Link
      href={resource.url}
      className="group block bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden hover:shadow-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
    >
      {/* Cover image with fallback */}
      <div className={`overflow-hidden ${featured ? 'h-48' : 'h-40'} bg-gradient-to-br from-coral-100 to-sage-100 dark:from-coral-900/30 dark:to-sage-900/30 flex items-center justify-center`}>
        {resource.cover ? (
          <img
            src={resource.cover}
            alt={resource.coverAlt || resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={(e) => {
              // Remove fallback styling when image loads successfully
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.className = `overflow-hidden ${featured ? 'h-48' : 'h-40'}`;
              }
            }}
          />
        ) : null}
        
        {/* Fallback icon - always present but hidden when image loads */}
        {!resource.cover && (
          <div className="text-coral-500 dark:text-coral-400 opacity-50">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Topics */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {resource.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900 px-2 py-1 text-xs font-medium text-teal-800 dark:text-teal-200"
            >
              {topic}
            </span>
          ))}
          {resource.topics.length > 2 && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              +{resource.topics.length - 2} more
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-neutral-700 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors ${
          featured ? 'text-xl mb-3' : 'text-lg mb-2'
        }`}>
          {resource.title}
        </h3>

        {/* Excerpt */}
        <p className={`text-neutral-600 dark:text-neutral-200 ${
          featured ? 'text-base mb-4' : 'text-sm mb-3'
        } line-clamp-3`}>
          {resource.excerpt}
        </p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            <span>{resource.author}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{formatDate(resource.publishedAt)}</span>
          </div>
          
          {resource.readingTime && (
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              <span>{resource.readingTime} min</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}