interface TimelineItem {
  period: 'Now' | 'Next' | 'Later'
  items: string[]
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className = '' }: TimelineProps) {
  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'Now': return 'bg-teal-500'
      case 'Next': return 'bg-coral-500'
      case 'Later': return 'bg-neutral-400'
      default: return 'bg-neutral-400'
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {items.map((timelineItem, index) => (
        <div key={timelineItem.period} className="flex gap-6">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full ${getPeriodColor(timelineItem.period)}`} />
            {index < items.length - 1 && (
              <div className="w-px h-16 bg-neutral-200 dark:bg-neutral-700 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-3">
              {timelineItem.period}
            </h3>
            <ul className="space-y-2">
              {timelineItem.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-neutral-600 dark:text-neutral-300 flex items-start">
                  <span className="text-coral-500 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}