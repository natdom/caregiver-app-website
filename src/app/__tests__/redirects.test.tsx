/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'

describe('Redirects Configuration', () => {
  it('should have press to partners redirect configured', async () => {
    // This test verifies the redirect configuration exists
    // In a real app, you would test the actual redirect behavior
    const { default: nextConfig } = await import('../../next.config.js')
    
    const redirects = await nextConfig.redirects()
    const pressRedirect = redirects.find(redirect => redirect.source === '/press')
    
    expect(pressRedirect).toBeDefined()
    expect(pressRedirect?.destination).toBe('/partners')
    expect(pressRedirect?.permanent).toBe(true)
  })
  
  it('should have proper redirect structure', async () => {
    const { default: nextConfig } = await import('../../next.config.js')
    const redirects = await nextConfig.redirects()
    
    redirects.forEach(redirect => {
      expect(redirect).toHaveProperty('source')
      expect(redirect).toHaveProperty('destination') 
      expect(redirect).toHaveProperty('permanent')
      expect(typeof redirect.permanent).toBe('boolean')
    })
  })
})