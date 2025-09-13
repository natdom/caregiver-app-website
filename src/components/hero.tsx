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
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          {/* Main headline */}
          <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-6xl lg:text-7xl">
            <span className="text-balance block mb-2">
              Caregiving is heavy.
            </span>
            <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent font-display">
              We're here to make it lighter.
            </span>
          </h1>
          
          {/* Subheadline with A/B test */}
          <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300 sm:text-xl" data-testid={heroContent.id}>
            {heroContent.headline}
          </p>

          {/* Single Primary CTA */}
          <div className="mt-12 flex justify-center">
            <Button 
              size="lg" 
              asChild 
              className="text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              data-testid="hero-cta"
            >
              <Link href="/waitlist" aria-label="Join the Support Network waitlist">
                Join the waitlist
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Testimonial */}
          <div className="mt-16 mx-auto max-w-md">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-6 text-center">
              <blockquote className="text-neutral-700 dark:text-neutral-300 italic text-sm mb-4">
                "Finally, a place where I don't feel alone in this journey. The practical tips and genuine understanding make all the difference."
              </blockquote>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-coral-200 dark:bg-coral-800 rounded-full flex items-center justify-center">
                  <span className="text-coral-800 dark:text-coral-200 font-semibold text-sm">MR</span>
                </div>
                <div className="text-left">
                  <div className="text-neutral-700 dark:text-white font-medium text-sm">Maria R.</div>
                  <div className="text-neutral-500 dark:text-neutral-400 text-xs">Caring for aging parent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social proof indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center space-x-2 group">
              <Users className="h-5 w-5 text-coral-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Growing community</span>
            </div>
            <div className="flex items-center space-x-2 group">
              <Lightbulb className="h-5 w-5 text-coral-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Practical guidance</span>
            </div>
            <div className="flex items-center space-x-2 group">
              <Heart className="h-5 w-5 text-coral-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Judgment-free space</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}