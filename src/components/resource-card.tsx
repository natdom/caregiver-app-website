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
      className="group block bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Cover image if available */}
      {resource.cover && (
        <div className={`overflow-hidden ${featured ? 'h-48' : 'h-40'}`}>
          <img
            src={resource.cover}
            alt={resource.coverAlt || resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Topics */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {resource.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center rounded-full bg-sky-100 dark:bg-sky-900 px-2 py-1 text-xs font-medium text-sky-800 dark:text-sky-200"
            >
              {topic}
            </span>
          ))}
          {resource.topics.length > 2 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              +{resource.topics.length - 2} more
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors ${
          featured ? 'text-xl mb-3' : 'text-lg mb-2'
        }`}>
          {resource.title}
        </h3>

        {/* Excerpt */}
        <p className={`text-slate-600 dark:text-slate-300 ${
          featured ? 'text-base mb-4' : 'text-sm mb-3'
        } line-clamp-3`}>
          {resource.excerpt}
        </p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
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