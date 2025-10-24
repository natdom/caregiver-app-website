import { Users, Feather, Sprout } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Connection',
    description:
      'Real connection starts with understanding. Find people who share your experiences and values, and feel part of a community that truly gets what caregiving means.',
  },
  {
    icon: Feather,
    title: 'Ease',
    description:
      'Simple, practical guidance that cuts through the noise. Get support that fits your life, reduces mental load, and helps you breathe a little easier.',
  },
  {
    icon: Sprout,
    title: 'Growth',
    description:
      "Caregiving changes you—and that's okay. We help you find balance, confidence, and new ways to grow through every stage of care.",
  },
]

export function FeatureGrid() {
  return (
    <section className="bg-white py-24 dark:bg-neutral-950 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
            How we help
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            Everything we build at withCare is designed to bring connection,
            ease, and growth to the caregiving journey.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-coral-300/30 hover:bg-white/20 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:hover:border-coral-400/30 dark:hover:bg-white/10"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-coral-100 transition-colors duration-300 group-hover:bg-coral-200 dark:bg-coral-900 dark:group-hover:bg-coral-800">
                  <feature.icon className="h-6 w-6 text-coral-600 transition-transform duration-300 group-hover:scale-110 dark:text-coral-400" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-neutral-700 dark:text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
