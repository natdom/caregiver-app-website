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

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300 sm:text-xl"
            data-testid={heroContent.id}
          >
            {heroContent.headline}
          </p>

          {/* Single Primary CTA */}
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              className="text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
              data-testid="hero-cta"
            >
              <Link
                href="/waitlist"
                aria-label="Join the waitlist for withCare"
              >
                Join the waitlist →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
