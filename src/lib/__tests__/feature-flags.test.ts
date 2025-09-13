import { getHeroVariant, heroVariants } from '../feature-flags'

// Mock environment variables
const mockEnv = (envVar: string | undefined) => {
  const originalEnv = process.env.NEXT_PUBLIC_HERO_VARIANT
  if (envVar !== undefined) {
    process.env.NEXT_PUBLIC_HERO_VARIANT = envVar
  } else {
    delete process.env.NEXT_PUBLIC_HERO_VARIANT
  }
  return () => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_HERO_VARIANT = originalEnv
    } else {
      delete process.env.NEXT_PUBLIC_HERO_VARIANT
    }
  }
}

describe('Feature Flags', () => {
  describe('getHeroVariant', () => {
    it('returns variant B by default', () => {
      const cleanup = mockEnv(undefined)
      
      const variant = getHeroVariant()
      expect(variant).toBe('B')
      
      cleanup()
    })

    it('returns variant B when environment variable is set to B', () => {
      const cleanup = mockEnv('B')
      
      const variant = getHeroVariant()
      expect(variant).toBe('B')
      
      cleanup()
    })

    it('returns variant A when environment variable is set to A', () => {
      const cleanup = mockEnv('A')
      
      const variant = getHeroVariant()
      expect(variant).toBe('A')
      
      cleanup()
    })

    it('returns variant B for invalid environment variable values', () => {
      const cleanup = mockEnv('invalid')
      
      const variant = getHeroVariant()
      expect(variant).toBe('B')
      
      cleanup()
    })
  })

  describe('heroVariants', () => {
    it('contains both variant A and B with correct structure', () => {
      expect(heroVariants).toHaveProperty('A')
      expect(heroVariants).toHaveProperty('B')
      
      expect(heroVariants.A).toHaveProperty('headline')
      expect(heroVariants.A).toHaveProperty('id')
      expect(heroVariants.B).toHaveProperty('headline')
      expect(heroVariants.B).toHaveProperty('id')
    })

    it('has distinct headlines for each variant', () => {
      expect(heroVariants.A.headline).toBe('Make caregiving lighter—practical guidance, real community, simple tools.')
      expect(heroVariants.B.headline).toBe('Less searching. More support. Join a community built for caregivers.')
      expect(heroVariants.A.headline).not.toBe(heroVariants.B.headline)
    })

    it('has unique test ids for each variant', () => {
      expect(heroVariants.A.id).toBe('variant-a')
      expect(heroVariants.B.id).toBe('variant-b')
      expect(heroVariants.A.id).not.toBe(heroVariants.B.id)
    })
  })
})