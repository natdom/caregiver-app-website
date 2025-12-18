import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Wrench, Heart } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Guidance shaped by caregiver experience',
    description:
      'Practical information, organized by what matters most.',
  },
  {
    icon: Users,
    title: 'A caregiver community that understands',
    description:
      "Ask questions, share what's working, and feel less alone.",
  },
  {
    icon: Wrench,
    title: 'Simple tools for everyday care',
    description:
      'Track care details without adding to your mental load.',
  },
  {
    icon: Heart,
    title: 'Support for the human side of caregiving',
    description:
      'Space for reflection, wellbeing, and checking in with yourself.',
  },
]

export function FundingSnapshot() {
  return (
    <section className="bg-white py-16 dark:bg-neutral-950 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* What we're building */}
          <div className="mb-10">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
                What we're building
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
                A digital platform where caregivers can find community, guidance, and practical tools without the noise, judgment, or overwhelm.
              </p>
            </div>

            <div className="mx-auto max-w-2xl space-y-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`relative rounded-xl p-8 text-center transition-all duration-300 ${
                    index % 2 === 0
                      ? 'bg-white/40 dark:bg-white/5'
                      : 'bg-transparent'
                  }`}
                >
                  {/* Number badge */}
                  <div className="mb-4 flex justify-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-coral-100 text-sm font-semibold text-coral-600 dark:bg-coral-900/50 dark:text-coral-400">
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-neutral-700 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/about">
                Learn more about withCare{' '}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
