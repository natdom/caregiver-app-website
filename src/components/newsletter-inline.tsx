'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsletterInlineProps {
  className?: string
  source?: string
  compact?: boolean
}

export function NewsletterInline({ 
  className, 
  source = 'resource_inline',
  compact = false 
}: NewsletterInlineProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      // Track signup attempt
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('resource_signup_inline', {
          props: { source, email_domain: email.split('@')[1] || 'unknown' }
        })
      }

      // Here you would typically call your email signup API
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn(
        "bg-gradient-to-r from-teal-50 to-coral-50 dark:from-teal-900/20 dark:to-coral-900/20 rounded-2xl border border-teal-200 dark:border-teal-800",
        compact ? "p-4" : "p-6",
        className
      )}>
        <div className="flex items-center justify-center text-center">
          <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-white">
              Thanks for joining!
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-200 mt-1">
              Check your email for our caregiving starter kit.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "bg-gradient-to-r from-teal-50 to-coral-50 dark:from-teal-900/20 dark:to-coral-900/20 rounded-2xl border border-teal-200 dark:border-teal-800",
      compact ? "p-4" : "p-6",
      className
    )}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-2">
            Get more resources like this
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-200 mb-4">
            Join 2,000+ caregivers getting practical tips and our free starter kit with templates, checklists, and planning tools.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                aria-label="Email address for newsletter signup"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={status === 'loading' || !email}
              className="whitespace-nowrap"
              size={compact ? "sm" : "default"}
            >
              {status === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Joining...
                </>
              ) : (
                <>
                  Get the kit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          {errorMessage && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {errorMessage}
            </p>
          )}
          
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}