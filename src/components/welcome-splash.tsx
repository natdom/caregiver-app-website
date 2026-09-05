'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { PeroLogo } from '@/components/pero-logo'
import { trackSplashEvent } from '@/lib/splash/analytics'

const SPLASH_SEEN_KEY = 'pero_splash_seen'

export function WelcomeSplash() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(SPLASH_SEEN_KEY)) {
        setOpen(true)
        trackSplashEvent('splash_shown')
      }
    } catch {
      // localStorage unavailable (private browsing, disabled storage) — skip the splash
    }
  }, [])

  function markSeen() {
    try {
      window.localStorage.setItem(SPLASH_SEEN_KEY, '1')
    } catch {
      // ignore write failures — worst case the splash shows again next visit
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      markSeen()
      trackSplashEvent('splash_dismissed')
    }
    setOpen(next)
  }

  function handleBrowseClick() {
    markSeen()
    trackSplashEvent('splash_browse_clicked')
    setOpen(false)
  }

  function handleAssessmentClick() {
    markSeen()
    trackSplashEvent('splash_assessment_clicked')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="text-center">
        <div className="flex justify-center">
          <PeroLogo className="h-9" />
        </div>
        <DialogTitle>
          Welcome to{' '}
          <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text font-display text-transparent">
            pero
          </span>
        </DialogTitle>
        <DialogDescription>
          Not sure where to start? Take our free 3-minute assessment to find your caregiving
          stage and get next steps made for you — or explore at your own pace.
        </DialogDescription>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            asChild
            className="text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <Link href="/assessment" onClick={handleAssessmentClick}>
              Take the assessment →
            </Link>
          </Button>
          <Button size="lg" variant="outline" onClick={handleBrowseClick}>
            Browse the site
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
