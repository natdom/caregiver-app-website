'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Mail } from 'lucide-react'

export function NewsletterInline() {
  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      const result = await response.json()
      
      toast({
        title: 'Thank you for joining!',
        description: result.message || 'We\'ll keep you updated on our progress.',
      })
      
      setEmail('')
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-gradient-to-r from-coral-50 to-sage-50 dark:from-neutral-900 dark:to-neutral-800 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Mail className="mx-auto h-16 w-16 text-coral-500 dark:text-coral-400 mb-8" aria-hidden="true" />
          <h2 className="text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
            Stay in the loop
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            Get updates on our progress, early access opportunities, and helpful caregiving resources delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4 sm:flex-row sm:max-w-md sm:mx-auto">
            <div className="flex-1">
              <Label htmlFor="email-inline" className="sr-only">
                Email address
              </Label>
              <Input
                id="email-inline"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white dark:bg-white/10 border-neutral-200 dark:border-white/20 text-neutral-700 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-300"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !email}
              className="bg-coral-600 hover:bg-coral-700 text-white"
            >
              {isLoading ? 'Joining...' : 'Join waitlist'}
            </Button>
          </form>
          
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  )
}