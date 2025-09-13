'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface StarterKitCTAProps {
  className?: string
  variant?: 'default' | 'compact'
}

const checklist = [
  'Care coordination templates',
  'Medical appointment tracker',
  'Emergency contact forms',
  'Self-care planning guide',
  'Medication management sheets'
]

export function StarterKitCTA({ className, variant = 'default' }: StarterKitCTAProps) {
  const handleCTAClick = () => {
    // Track CTA click
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('starter_kit_cta_click', {
        props: { location: 'end_of_article', variant }
      })
    }
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        "bg-gradient-to-r from-coral-50 to-teal-50 dark:from-coral-900/20 dark:to-teal-900/20 rounded-2xl border border-coral-200 dark:border-coral-800 p-6",
        className
      )}>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-coral-100 dark:bg-coral-900 rounded-full flex items-center justify-center">
              <Download className="h-6 w-6 text-coral-600 dark:text-coral-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-1">
              Get the Caregiver Starter Kit
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-200 mb-3">
              Free templates, checklists, and planning tools to get organized quickly.
            </p>
            
            <Button asChild size="sm" onClick={handleCTAClick}>
              <Link href="/waitlist?source=starter_kit_compact">
                Download free kit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "bg-gradient-to-br from-coral-50 via-teal-50 to-sage-50 dark:from-coral-900/20 dark:via-teal-900/20 dark:to-sage-900/20 rounded-2xl border border-coral-200 dark:border-coral-800 p-8",
      className
    )}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-coral-100 dark:bg-coral-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="h-8 w-8 text-coral-600 dark:text-coral-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-neutral-700 dark:text-white mb-3">
          Ready to get organized?
        </h3>
        
        <p className="text-lg text-neutral-600 dark:text-neutral-200 mb-6 max-w-2xl mx-auto">
          Get our free Caregiver Starter Kit with templates, checklists, and planning tools to help you feel more prepared and less overwhelmed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h4 className="font-semibold text-neutral-700 dark:text-white mb-4">
            What's included:
          </h4>
          
          <div className="space-y-3">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span className="text-neutral-600 dark:text-neutral-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 mb-6">
            <div className="text-3xl font-bold text-coral-600 dark:text-coral-400 mb-1">
              Free
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              No credit card required
            </div>
            
            <Button asChild size="lg" className="w-full font-semibold" onClick={handleCTAClick}>
              <Link href="/waitlist?source=starter_kit_full">
                Get your starter kit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Join 2,000+ caregivers who trust us with their journey
          </p>
        </div>
      </div>
    </div>
  )
}