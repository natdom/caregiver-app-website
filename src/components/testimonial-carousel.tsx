'use client'

import * as React from 'react'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      "This feels like something caregivers have needed for a long time. It's clear, supportive, and real.",
    author: 'Participant from early feedback session',
    context: '',
  },
  {
    quote:
      "I'm excited to see this come to life. Even reading the early content makes me feel understood.",
    author: 'Parent and caregiver',
    context: 'Calgary',
  },
  {
    quote:
      "It's rare to see a space being built with this much empathy. You can tell it comes from lived experience.",
    author: 'Community member',
    context: 'early tester',
  },
]

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-coral-50 py-24 dark:bg-neutral-800 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
            What people are saying
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentIndex
                    ? 'opacity-100'
                    : 'absolute inset-0 opacity-0'
                }`}
                aria-hidden={index !== currentIndex}
              >
                <figure className="text-center">
                  <Quote
                    className="mx-auto mb-8 h-12 w-12 text-coral-500"
                    aria-hidden="true"
                  />
                  <blockquote className="text-2xl font-medium text-neutral-700 dark:text-white sm:text-3xl">
                    "{testimonial.quote}"
                  </blockquote>
                  <figcaption className="mt-8 text-lg text-neutral-600 dark:text-neutral-300">
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-neutral-500 dark:text-neutral-400">
                      {testimonial.context}
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="mt-12 flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-coral-500'
                    : 'bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
