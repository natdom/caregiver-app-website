import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
  description:
    "Learn about withCare's mission to make every caregiver's day a little lighter through connection, ease, and growth.",
}

const values = [
  {
    icon: '/icons/heart.png',
    title: 'Empathy First',
    description:
      'We start by listening and learning from caregivers. The goal is to build tools and resources that genuinely help, not add noise.',
  },
  {
    icon: '/icons/people.png',
    title: 'Community-Centered',
    description:
      "Caregiving can feel isolating. We're making it easier for people to find support, share insight, and feel understood.",
  },
  {
    icon: '/icons/clipboard.png',
    title: 'Practical Focus',
    description:
      'Clear, useful guidance that fits into real lives with no jargon, no filler.',
  },
  {
    icon: '/icons/calendar.png',
    title: 'Respect for Time',
    description:
      'Caregivers are busy. Everything we design should be easy to use, quick to read, and worth your time.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,transparent)] dark:opacity-20" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl">
              Why{' '}
              <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent">
                withCare
              </span>{' '}
              exists
            </h1>
            <p className="mt-6 text-xl leading-8 text-neutral-600 dark:text-neutral-300">
              Caregiving touches millions of lives, yet too many caregivers feel
              isolated, overwhelmed, and unsupported. We're here to change that.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="group relative overflow-hidden rounded-2xl border border-coral-200/20 bg-gradient-to-br from-coral-50/50 via-white/10 to-teal-50/50 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-coral-500/20 dark:from-coral-900/20 dark:via-neutral-800/50 dark:to-teal-900/20 sm:p-12">
              {/* Subtle accent */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-coral-200/20 blur-3xl dark:bg-coral-500/10" />

              <h2 className="relative mb-6 text-3xl font-bold text-neutral-700 dark:text-white">
                Our mission
              </h2>
              <p className="relative mb-8 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                To make every caregiver's day a little lighter through
                connection, ease, and growth.
              </p>
              <div className="relative grid gap-8 sm:grid-cols-2">
                <div className="rounded-xl border border-teal-200/30 bg-white/30 p-6 backdrop-blur-sm dark:border-teal-500/20 dark:bg-white/5">
                  <h3 className="mb-4 text-xl font-semibold text-neutral-700 dark:text-white">
                    Who we serve
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-teal-500">•</span>
                      <span>
                        Caregivers of all kinds: family, partners, friends
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-teal-500">•</span>
                      <span>
                        Those supporting aging, illness, or disability
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-teal-500">•</span>
                      <span>Anyone coordinating care or advocacy</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-coral-200/30 bg-white/30 p-6 backdrop-blur-sm dark:border-coral-500/20 dark:bg-white/5">
                  <h3 className="mb-4 text-xl font-semibold text-neutral-700 dark:text-white">
                    What makes us different
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-coral-500">•</span>
                      <span>Built with caregivers, not just for them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-coral-500">•</span>
                      <span>Judgment-free and supportive by design</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-coral-500">•</span>
                      <span>Practical help that lightens the mental load</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-8">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-50/30 to-transparent dark:via-teal-900/10" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
              Our values guide everything we build
            </h2>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-coral-300/30 hover:bg-white/20 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:hover:border-coral-500/30 dark:hover:bg-white/10"
                >
                  {/* Animated gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-coral-500/5 via-transparent to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-coral-500/10 dark:to-teal-500/10" />

                  <div className="relative">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src={value.icon}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 object-contain"
                      />
                    </div>
                    <h3 className="mb-4 text-xl font-semibold text-neutral-700 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5 sm:p-12">
              <h2 className="mb-6 text-3xl font-bold text-neutral-700 dark:text-white">
                Building this step by step
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                We're starting simple and building in stages, learning from
                caregivers along the way.
              </p>
              <div className="space-y-6">
                <div className="rounded-xl border-l-4 border-coral-400 bg-white/40 p-6 dark:border-coral-400 dark:bg-white/5">
                  <h3 className="mb-3 text-lg font-semibold text-neutral-700 dark:text-white">
                    Right now: Foundation (Mid 2025 – Early 2026)
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Building the platform and resource library</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Partnering with organizations who get it</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Learning from early users</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border-l-4 border-teal-400 bg-white/40 p-6 dark:border-teal-400 dark:bg-white/5">
                  <h3 className="mb-3 text-lg font-semibold text-neutral-700 dark:text-white">
                    Next: Community (2026)
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Opening up community features</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Creating spaces for peer support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Improving based on what you tell us</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border-l-4 border-sage-400 bg-white/40 p-6 dark:border-sage-400 dark:bg-white/5">
                  <h3 className="mb-3 text-lg font-semibold text-neutral-700 dark:text-white">
                    Then: Growing together (Late 2026 – 2027)
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Tailoring experiences for each caregiver</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Connecting resources and tools more deeply</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-neutral-400">•</span>
                      <span>Evolving alongside the community</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
