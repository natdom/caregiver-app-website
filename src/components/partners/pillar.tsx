import { LucideIcon } from 'lucide-react'

interface PillarProps {
  icon: LucideIcon
  title: string
  outcome: string
  className?: string
}

export function Pillar({ icon: Icon, title, outcome, className = '' }: PillarProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex justify-center mb-4">
        <Icon className="h-12 w-12 text-coral-600 dark:text-coral-400" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
        {outcome}
      </p>
    </div>
  )
}