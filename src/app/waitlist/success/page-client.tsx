'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Twitter, Linkedin } from 'lucide-react'
import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

export default function SuccessPageClient() {
  const searchParams = useSearchParams()
  
  // Track analytics on page load
  useEffect(() => {
    const role = searchParams.get('role') || 'unknown'
    const hasName = searchParams.get('name') === 'true'
    const hasChallenge = searchParams.get('challenge') === 'true'
    
    analytics.waitlistSubmit(role, hasName, hasChallenge)
  }, [searchParams])

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${baseUrl}/waitlist`
    
    const messages = {
      twitter: "I just joined the Support Network waitlist! 🤝 A platform designed to make caregiving lighter through connection, clarity, and care. Join me!",
      linkedin: "I'm excited to be part of the Support Network community! It's a platform designed to support family caregivers through connection, clarity, and care. If you're a caregiver or know someone who is, I'd encourage you to check it out."
    }
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messages.twitter)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(messages.linkedin)}`
    }
    
    // Track share click
    analytics.pageView(`${platform}_share_click` as any)
    
    // Open share window
    if (typeof window !== 'undefined') {
      window.open(
        urls[platform], 
        'share-window',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      )
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button 
        variant="outline" 
        size="lg"
        onClick={() => handleShare('twitter')}
        className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
      >
        <Twitter className="mr-2 h-5 w-5" />
        Share on X
      </Button>
      
      <Button 
        variant="outline" 
        size="lg"
        onClick={() => handleShare('linkedin')}
        className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
      >
        <Linkedin className="mr-2 h-5 w-5" />
        Share on LinkedIn
      </Button>
    </div>
  )
}