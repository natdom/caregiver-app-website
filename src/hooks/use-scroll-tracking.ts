'use client'

import { useEffect, useRef } from 'react'

interface UseScrollTrackingProps {
  onScrollProgress: (progress: number) => void
  threshold?: number
}

export function useScrollTracking({ onScrollProgress, threshold = 0.1 }: UseScrollTrackingProps) {
  const hasTriggered = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight

      // Trigger callback with current progress
      onScrollProgress(scrollPercent)

      // Track 50% milestone once
      if (scrollPercent >= 0.5 && !hasTriggered.current) {
        hasTriggered.current = true
        
        if (typeof window !== 'undefined' && (window as any).plausible) {
          (window as any).plausible('resource_read_50%', {
            props: { 
              page: window.location.pathname,
              timestamp: new Date().toISOString()
            }
          })
        }
      }
    }

    // Throttle scroll events
    let ticking = false
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler)
    }
  }, [onScrollProgress])

  return { hasTriggered: hasTriggered.current }
}