'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { submitWaitlistForm, type WaitlistActionResult } from '@/lib/actions/waitlist'
import { roleOptions } from '@/lib/validations/waitlist'
import { Loader2, Mail, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit" 
      size="lg" 
      disabled={pending}
      className="w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Joining waitlist...
        </>
      ) : (
        <>
          <Mail className="mr-2 h-5 w-5" />
          Join the waitlist
        </>
      )}
    </Button>
  )
}

interface FormFieldProps {
  id: string
  children: React.ReactNode
  error?: string[]
  required?: boolean
}

function FormField({ id, children, error, required }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {children}
      {error && (
        <div 
          id={`${id}-error`}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error[0]}
        </div>
      )}
    </div>
  )
}

interface WaitlistFormProps {
  className?: string
  showTitle?: boolean
}

export function WaitlistForm({ className, showTitle = true }: WaitlistFormProps) {
  const [state, formAction] = useFormState<WaitlistActionResult | null, FormData>(
    submitWaitlistForm,
    null
  )
  
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  
  // Announce form submission status to screen readers
  const statusRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (state?.message && statusRef.current) {
      statusRef.current.textContent = state.message
    }
  }, [state])

  // Reset form on successful submission (shouldn't happen due to redirect, but good practice)
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
      setSelectedRole('')
    }
  }, [state?.success])

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-700 dark:text-white mb-2">
            Join the waitlist
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Be the first to know when we launch
          </p>
        </div>
      )}

      {/* Hidden status announcements for screen readers */}
      <div
        ref={statusRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <form ref={formRef} action={formAction} className="space-y-6">
        
        {/* Name field (optional) */}
        <FormField id="name" error={state?.errors?.name}>
          <Label htmlFor="name" className="text-sm font-medium">
            Name (optional)
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className="w-full"
            aria-describedby={state?.errors?.name ? 'name-error' : undefined}
          />
        </FormField>

        {/* Email field (required) */}
        <FormField id="email" error={state?.errors?.email} required>
          <Label htmlFor="email" className="text-sm font-medium">
            Email address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            required
            className="w-full"
            aria-describedby={state?.errors?.email ? 'email-error' : undefined}
          />
        </FormField>

        {/* Role field (required) */}
        <FormField id="role" error={state?.errors?.role} required>
          <Label className="text-sm font-medium">
            Your role <span className="text-red-500">*</span>
          </Label>
          <div 
            className="space-y-3"
            role="radiogroup"
            aria-labelledby="role-label"
            aria-describedby={state?.errors?.role ? 'role-error' : undefined}
            aria-required="true"
          >
            {roleOptions.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={selectedRole === option.value}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1 h-4 w-4 border-neutral-300 text-coral-600 focus:ring-coral-500 focus:ring-2 focus:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-800"
                  aria-describedby={`${option.value}-description`}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-700 dark:text-white group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors">
                    <Users className="inline h-4 w-4 mr-1" aria-hidden="true" />
                    {option.label}
                  </div>
                  <p id={`${option.value}-description`} className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </FormField>

        {/* Challenge field (optional) */}
        <FormField id="challenge" error={state?.errors?.challenge}>
          <Label htmlFor="challenge" className="text-sm font-medium">
            What's your biggest caregiving challenge? (optional)
          </Label>
          <Textarea
            id="challenge"
            name="challenge"
            placeholder="Share what would help you most in your caregiving journey..."
            rows={3}
            maxLength={500}
            className="w-full resize-none"
            aria-describedby={state?.errors?.challenge ? 'challenge-error' : 'challenge-hint'}
          />
          <p id="challenge-hint" className="text-xs text-neutral-500 dark:text-neutral-400">
            This helps us build features that matter most to you.
          </p>
        </FormField>

        {/* Consent checkbox (required) */}
        <FormField id="consent" error={state?.errors?.consent} required>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              name="consent"
              required
              className="mt-1"
              aria-describedby={state?.errors?.consent ? 'consent-error' : 'consent-description'}
            />
            <div className="space-y-1">
              <Label 
                htmlFor="consent" 
                className="text-sm leading-relaxed cursor-pointer"
              >
                I agree to receive updates about withCare <span className="text-red-500">*</span>
              </Label>
              <p id="consent-description" className="text-xs text-neutral-500 dark:text-neutral-400">
                We'll send you launch updates and caregiver resources. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </FormField>

        {/* General form error message */}
        {state?.message && !state.success && (
          <div 
            className="rounded-md bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800"
            role="alert"
          >
            <div className="text-sm text-red-800 dark:text-red-200">
              {state.message}
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="space-y-4">
          <SubmitButton />
          
          {/* Benefit text */}
          <div className="text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <span className="font-medium text-coral-600 dark:text-coral-400">
                Join early members shaping withCare
              </span>
              <br />
              Plus get the <strong>Caregiver Starter Kit</strong> when you join.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}