'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Mail, MapPin, Clock } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(1, 'Please select your role'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: ContactForm) => {
    setIsLoading(true)

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast({
        title: 'Message sent!',
        description: 'Thank you for reaching out. We\'ll get back to you soon.',
      })

      reset()
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later or email us directly.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 dark:from-slate-900 dark:via-sky-900 dark:to-slate-900 min-h-screen">
      {/* Header */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-sky-500 mt-1" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Email</div>
                      <div className="text-slate-600 dark:text-slate-300">
                        <a href="mailto:hello@support.network" className="hover:text-sky-600 dark:hover:text-sky-400">
                          hello@support.network
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-sky-500 mt-1" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Response Time</div>
                      <div className="text-slate-600 dark:text-slate-300">
                        We typically respond within 24 hours
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-sky-500 mt-1" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Based in</div>
                      <div className="text-slate-600 dark:text-slate-300">
                        United States
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-4">
                    What to expect
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li>• Personal response from our team</li>
                    <li>• Follow-up within one business day</li>
                    <li>• Thoughtful consideration of your message</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Your name"
                        disabled={isLoading}
                        aria-invalid={errors.name ? 'true' : 'false'}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="your.email@example.com"
                        disabled={isLoading}
                        aria-invalid={errors.email ? 'true' : 'false'}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-sm font-medium">
                      I am a... *
                    </Label>
                    <Select 
                      value={selectedRole} 
                      onValueChange={(value) => setValue('role', value)}
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
                        <SelectItem value="media">Media/Press</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Tell us how we can help, or what you'd like to know..."
                      className="min-h-[120px]"
                      disabled={isLoading}
                      aria-invalid={errors.message ? 'true' : 'false'}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending message...' : 'Send message'}
                  </Button>

                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}