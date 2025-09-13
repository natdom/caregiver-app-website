import { renderHook } from '@testing-library/react'
import { useScrollTracking } from '../use-scroll-tracking'

// Mock Plausible
const mockPlausible = vi.fn()
Object.defineProperty(window, 'plausible', {
  value: mockPlausible,
  writable: true
})

// Mock scrolling behavior
const mockScrollTo = (top: number) => {
  Object.defineProperty(window, 'scrollY', { value: top, writable: true })
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true })
  Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })
  
  // Trigger scroll event
  window.dispatchEvent(new Event('scroll'))
}

describe('useScrollTracking', () => {
  beforeEach(() => {
    mockPlausible.mockClear()
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    Object.defineProperty(window, 'location', {
      value: { pathname: '/resources/test-article' },
      writable: true
    })
  })

  afterEach(() => {
    // Clean up event listeners
    window.removeEventListener('scroll', () => {})
  })

  it('calls onScrollProgress with correct progress', () => {
    const mockOnScrollProgress = vi.fn()
    
    renderHook(() => useScrollTracking({
      onScrollProgress: mockOnScrollProgress
    }))

    // Scroll to 25% (300px out of 1200px scrollable)
    mockScrollTo(300)

    expect(mockOnScrollProgress).toHaveBeenCalledWith(0.25)
  })

  it('tracks 50% milestone once', () => {
    const mockOnScrollProgress = vi.fn()
    
    renderHook(() => useScrollTracking({
      onScrollProgress: mockOnScrollProgress
    }))

    // Scroll to 50%
    mockScrollTo(600)

    expect(mockPlausible).toHaveBeenCalledWith('resource_read_50%', {
      props: { 
        page: '/resources/test-article',
        timestamp: expect.any(String)
      }
    })

    // Clear the mock and scroll past 50% again
    mockPlausible.mockClear()
    mockScrollTo(800)

    // Should not trigger again
    expect(mockPlausible).not.toHaveBeenCalled()
  })

  it('only tracks 50% milestone once per session', () => {
    const mockOnScrollProgress = vi.fn()
    
    const { rerender } = renderHook(() => useScrollTracking({
      onScrollProgress: mockOnScrollProgress
    }))

    // Scroll to 50%
    mockScrollTo(600)
    expect(mockPlausible).toHaveBeenCalledTimes(1)

    // Scroll back down
    mockScrollTo(200)
    
    // Scroll to 50% again
    mockScrollTo(600)
    
    // Should still only have been called once
    expect(mockPlausible).toHaveBeenCalledTimes(1)
  })

  it('handles edge case where document height is small', () => {
    const mockOnScrollProgress = vi.fn()
    
    // Set up very small document
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 500, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })
    
    renderHook(() => useScrollTracking({
      onScrollProgress: mockOnScrollProgress
    }))

    // Try to scroll (should handle negative scrollable area)
    mockScrollTo(100)

    // Should handle gracefully without errors
    expect(mockOnScrollProgress).toHaveBeenCalled()
  })

  it('provides hasTriggered status', () => {
    const mockOnScrollProgress = vi.fn()
    
    const { result } = renderHook(() => useScrollTracking({
      onScrollProgress: mockOnScrollProgress
    }))

    // Initially should not have triggered
    expect(result.current.hasTriggered).toBe(false)

    // Scroll to 50%
    mockScrollTo(600)

    // Should now have triggered
    expect(result.current.hasTriggered).toBe(true)
  })

  it('handles missing plausible gracefully', () => {
    // Remove plausible
    delete (window as any).plausible

    const mockOnScrollProgress = vi.fn()
    
    renderHook(() => useScrollTracking({
      onScrollProgress: mockOnScrollProgress
    }))

    // Should not throw error when scrolling to 50%
    expect(() => mockScrollTo(600)).not.toThrow()
    expect(mockOnScrollProgress).toHaveBeenCalledWith(0.5)
  })

  it('uses requestAnimationFrame for performance', () => {
    const mockRAF = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(0)
      return 0
    })

    const mockOnScrollProgress = vi.fn()
    
    renderHook(() => useScrollTracking({
      onScrollProgress: mockOnScrollProgress
    }))

    mockScrollTo(300)

    expect(mockRAF).toHaveBeenCalled()
    
    mockRAF.mockRestore()
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useScrollTracking({
      onScrollProgress: vi.fn()
    }))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    
    removeEventListenerSpy.mockRestore()
  })
})