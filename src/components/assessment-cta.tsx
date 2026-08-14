import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AssessmentCTA() {
  return (
    <section className="bg-coral-50 py-12 dark:bg-neutral-900 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-coral-600 dark:text-coral-400">
            Know your caregiving stage
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-3xl">
            Not sure where you are in your caregiving journey?
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
            Take pero&apos;s free 3-minute assessment and discover your stage — with personalized next
            steps.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              className="shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <Link href="/assessment">Start the Assessment →</Link>
            </Button>
          </div>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            3 minutes · 16 questions · No account needed
          </p>
        </div>
      </div>
    </section>
  )
}
