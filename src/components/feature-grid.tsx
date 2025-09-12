import { Users, Lightbulb, Heart } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Connection',
    description: 'Find people who get it. Connect with caregivers who understand your unique challenges and celebrate your wins.',
  },
  {
    icon: Lightbulb,
    title: 'Clarity',
    description: 'Practical tips, not platitudes. Get actionable advice that fits your real-world situation from people who\'ve been there.',
  },
  {
    icon: Heart,
    title: 'Care',
    description: 'Tools and guidance that respect your reality. Resources designed for busy caregivers who need solutions, not more complexity.',
  },
]

export function FeatureGrid() {
  return (
    <section className="bg-white dark:bg-neutral-950 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
            How we help
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            We focus on three core pillars that make caregiving more manageable
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-coral-300/30 hover:bg-white/20 dark:border-white/10 dark:bg-white/5 dark:hover:border-coral-400/30 dark:hover:bg-white/10"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-coral-100 dark:bg-coral-900 mb-6 group-hover:bg-coral-200 dark:group-hover:bg-coral-800 transition-colors duration-300">
                  <feature.icon className="h-6 w-6 text-coral-600 dark:text-coral-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
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