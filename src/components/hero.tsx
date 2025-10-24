'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Lightbulb, Heart } from 'lucide-react'
import { getHeroVariant, heroVariants } from '@/lib/feature-flags'

export function Hero() {
  const variant = getHeroVariant()
  const heroContent = heroVariants[variant]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,theme(colors.neutral.50),rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,theme(colors.neutral.900),rgba(0,0,0,0))]" />

      <div className="container relative mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl animate-fade-in text-center">
          {/* Main headline */}
          <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-6xl lg:text-7xl">
            <span className="mb-2 block text-balance">
              Caregiving is heavy.
            </span>
            <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text font-display text-transparent">
              We're here to make it lighter.
            </span>
          </h1>

          {/* Subheadline with A/B test */}
          <p
            className="mx-auto mt-8 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300 sm:text-xl"
            data-testid={heroContent.id}
          >
            {heroContent.headline}
          </p>

          {/* Single Primary CTA */}
          <div className="mt-12 flex flex-col items-center">
            <Button
              size="lg"
              asChild
              className="text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
              data-testid="hero-cta"
            >
              <Link
                href="/waitlist"
                aria-label="Be part of what we're building with withCare"
              >
                Be part of what we're building →
              </Link>
            </Button>
            <p className="mt-4 max-w-md text-center text-sm text-neutral-600 dark:text-neutral-400">
              withCare is in early development. We're creating this space with
              real caregiver input.
            </p>
          </div>

          {/* Testimonial */}
          <div className="mx-auto mt-16 max-w-md">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <blockquote className="mb-4 text-sm italic text-neutral-700 dark:text-neutral-300">
                "This feels like something caregivers have needed for a long
                time. It's clear, supportive, and real."
              </blockquote>
              <div className="flex items-center justify-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-200 dark:bg-coral-800">
                  <span className="text-sm font-semibold text-coral-800 dark:text-coral-200">
                    P
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-neutral-700 dark:text-white">
                    Participant from early feedback session
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social proof indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-neutral-500 dark:text-neutral-400">
            <div className="group flex items-center space-x-2">
              <Users className="h-5 w-5 text-coral-500 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">Growing community</span>
            </div>
            <div className="group flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-coral-500 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">Practical guidance</span>
            </div>
            <div className="group flex items-center space-x-2">
              <Heart className="h-5 w-5 text-coral-500 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">Judgment-free space</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
