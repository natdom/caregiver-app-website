'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PeroLogoProps {
  className?: string
  variant?: 'light' | 'dark' | 'auto'
}

export function PeroLogo({ className, variant = 'auto' }: PeroLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn('h-11 w-auto', className)}
        style={{ width: '140px' }}
      />
    )
  }

  const isDark =
    variant === 'dark' || (variant === 'auto' && resolvedTheme === 'dark')

  return (
    <Image
      src={isDark ? '/images/pero-logo-dark.png' : '/images/pero-logo.png'}
      alt="pero"
      width={1302}
      height={483}
      className={cn('w-auto transition-opacity duration-200', className)}
      priority
    />
  )
}

