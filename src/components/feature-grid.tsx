import Image from 'next/image'

const features = [
  {
    icon: '/icons/people.png',
    title: 'Connection',
    description:
      'A space where your experiences are seen, shared, and understood.',
  },
  {
    icon: '/icons/clipboard.png',
    title: 'Ease',
    description:
      'Support designed to reduce the noise, stress, and mental weight of caregiving.',
  },
  {
    icon: '/icons/lightbulb.png',
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
                className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50/50 p-8 transition-all duration-300 hover:border-neutral-200 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center">
                    <Image
                      src={feature.icon}
                      alt=""
                      width={80}
                      height={80}
                      className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
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
