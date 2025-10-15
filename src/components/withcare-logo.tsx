'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface WithCareLogoProps {
  className?: string
}

export function WithCareLogo({ className }: WithCareLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder that matches the logo dimensions during SSR
    return <div className={cn('h-11 w-auto', className)} style={{ width: '140px' }} />
  }

  return (
    <Image
      src={resolvedTheme === 'dark' ? '/images/withcare-logo-dark.png' : '/images/withcare-logo.png'}
      alt="withCare"
      width={450}
      height={135}
      className={cn('w-auto transition-opacity duration-200', className)}
      priority
    />
  )
}
