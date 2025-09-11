'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Lightbulb, Heart } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 dark:from-slate-900 dark:via-sky-900 dark:to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container relative mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main headline */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            <span className="text-balance">
              Caregiving is heavy.
            </span>
            <br />
            <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
              We're here to make it lighter.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
            Support Network is a welcoming place to learn, share, and feel supported—designed with caregivers in mind.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="text-lg">
              <Link href="/newsletter">
                Join the waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg">
              <Link href="/resources">Explore resources</Link>
            </Button>
          </div>

          {/* Social proof indicators */}
          <div className="mt-16 flex items-center justify-center space-x-8 text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Growing community</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span className="text-sm">Practical guidance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span className="text-sm">Judgment-free space</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}