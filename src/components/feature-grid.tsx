import { Users, Feather, Sprout } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Connection',
    description:
      'A space where your experiences are seen, shared, and understood.',
  },
  {
    icon: Feather,
    title: 'Ease',
    description:
      'Support designed to reduce the noise, stress, and mental weight of caregiving.',
  },
  {
    icon: Sprout,
    title: 'Growth',
    description:
      'Encouragement and clarity to help you move forward with confidence.',
  },
]

export function FeatureGrid() {
  return (
    <section className="bg-white pb-10 pt-16 dark:bg-neutral-950 sm:pb-12 sm:pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
            How we help
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            Everything we build at withCare is designed to bring connection,
            ease, and growth to the caregiving journey.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/60 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {/* Gradient border glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-coral-500/20 to-teal-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 shadow-md transition-transform duration-300 group-hover:scale-110 dark:from-coral-600 dark:to-coral-700">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-neutral-700 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
