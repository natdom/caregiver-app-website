import Link from 'next/link'

interface StatProps {
  number: string
  description: string
  source?: {
    title: string
    url: string
    date: string
  }
  className?: string
}

export function Stat({ number, description, source, className = '' }: StatProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-3xl md:text-4xl font-bold text-coral-600 dark:text-coral-400 mb-2">
        {number}
      </div>
      <div className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
        {description}
      </div>
      {source && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          <Link 
            href={source.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-coral-600 dark:hover:text-coral-400 transition-colors"
          >
            {source.title}
          </Link>
          {' • '}
          {source.date}
        </div>
      )}
    </div>
  )
}