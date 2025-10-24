export type HeroVariant = 'A' | 'B'

export function getHeroVariant(): HeroVariant {
  // Check environment variable first
  if (process.env.NEXT_PUBLIC_HERO_VARIANT === 'A') {
    return 'A'
  }

  // Default to variant B (chosen for production)
  return 'B'
}

export const heroVariants = {
  A: {
    headline:
      'Less searching. More support. Join us as we build a supportive space for caregivers.',
    id: 'variant-a',
  },
  B: {
    headline:
      'Less searching. More support. Join us as we build a supportive space for caregivers.',
    id: 'variant-b',
  },
} as const
