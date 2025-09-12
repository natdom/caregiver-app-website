'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Lightbulb, Heart } from 'lucide-react'

export function Hero() {
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
          
          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300 sm:text-xl">
            Support Network is a welcoming place to learn, share, and feel supported—designed with caregivers in mind.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <Link href="/newsletter">
                Join the waitlist
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg border-2 hover:bg-coral-50 dark:hover:bg-coral-900/20 transition-all duration-200">
              <Link href="/resources">Explore resources</Link>
            </Button>
          </div>

          {/* Social proof indicators */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-neutral-500 dark:text-neutral-400">
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