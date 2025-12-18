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
  compact = false,
}: NewsletterInlineProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      // Track signup attempt
      if (typeof window !== 'undefined' && (window as any).plausible) {
        ;(window as any).plausible('resource_signup_inline', {
          props: { source, email_domain: email.split('@')[1] || 'unknown' },
        })
      }

      // Here you would typically call your email signup API
      // For now, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-coral-50 dark:border-teal-800 dark:from-teal-900/20 dark:to-coral-900/20',
          compact ? 'p-4' : 'p-6',
          className
        )}
      >
        <div className="flex items-center justify-center text-center">
          <CheckCircle className="mr-3 h-6 w-6 text-teal-600 dark:text-teal-400" />
          <div>
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-white">
              Thanks for joining!
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-200">
              We'll be in touch soon.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-coral-50 dark:border-teal-800 dark:from-teal-900/20 dark:to-coral-900/20',
        compact ? 'p-4' : 'p-6',
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
            <Mail className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-lg font-medium text-neutral-700 dark:text-neutral-200">
            Join our early updates.
          </p>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
            Follow progress, share feedback, and help shape withCare as it grows.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                aria-label="Email address for newsletter signup"
              />
            </div>

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="whitespace-nowrap"
              size={compact ? 'sm' : 'default'}
            >
              {status === 'loading' ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Joining...
                </>
              ) : (
                <>Join the waitlist →</>
              )}
            </Button>
          </form>

          {errorMessage && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          )}

          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
