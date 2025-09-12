'use client'

import type { Metadata } from 'next'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Users, Bell, Heart } from 'lucide-react'

export default function NewsletterPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    role: '',
    challenge: '',
    consent: false,
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.consent) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          role: formData.role,
          challenge: formData.challenge,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      const result = await response.json()
      
      toast({
        title: 'Welcome to the waitlist!',
        description: result.message || 'We\'ll keep you updated on our progress and early access opportunities.',
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: '',
        challenge: '',
        consent: false,
      })
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
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 min-h-screen">
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Mail className="mx-auto h-16 w-16 text-coral-500 mb-8" aria-hidden="true" />
            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl">
              Join the waitlist
            </h1>
            <p className="mt-6 text-xl leading-8 text-neutral-600 dark:text-neutral-200">
              Be the first to know when Support Network launches. Get early access and help shape 
              the caregiving community you need.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-center text-neutral-700 dark:text-white mb-12">
              What you'll get
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-coral-500 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-2">
                  Early Access
                </h3>
                <p className="text-neutral-600 dark:text-neutral-200">
                  Be among the first to join our community when we launch
                </p>
              </div>
              <div className="text-center">
                <Bell className="mx-auto h-12 w-12 text-coral-500 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-2">
                  Progress Updates
                </h3>
                <p className="text-neutral-600 dark:text-neutral-200">
                  Monthly updates on our development and community building
                </p>
              </div>
              <div className="text-center">
                <Heart className="mx-auto h-12 w-12 text-coral-500 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-2">
                  Helpful Resources
                </h3>
                <p className="text-neutral-600 dark:text-neutral-200">
                  Curated caregiving tips and resources delivered to your inbox
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8 sm:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role" className="text-sm font-medium">
                    I am a...
                  </Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caregiver">Family caregiver</SelectItem>
                      <SelectItem value="professional">Healthcare professional</SelectItem>
                      <SelectItem value="funder">Potential funder/investor</SelectItem>
                      <SelectItem value="partner">Potential partner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="challenge" className="text-sm font-medium">
                    What's your biggest caregiving challenge right now? (Optional)
                  </Label>
                  <Textarea
                    id="challenge"
                    placeholder="Share what's on your mind... This helps us build what you need most."
                    value={formData.challenge}
                    onChange={(e) => handleInputChange('challenge', e.target.value)}
                    className="min-h-[100px]"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => handleInputChange('consent', !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="consent" className="text-sm text-neutral-600 dark:text-neutral-200 leading-relaxed">
                    I'd like to receive updates about Support Network's progress and early access opportunities. 
                    I understand I can unsubscribe at any time.
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || !formData.name || !formData.email || !formData.consent}
                >
                  {isLoading ? 'Joining waitlist...' : 'Join the waitlist'}
                </Button>

                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                  We respect your privacy. No spam, ever. Unsubscribe with one click.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}