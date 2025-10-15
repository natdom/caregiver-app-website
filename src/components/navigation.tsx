'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WithCareLogo } from '@/components/withcare-logo'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resources', label: 'Resources' },
  { href: '/partners', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const closeMenu = () => setIsOpen(false)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60">
      <nav className="container flex h-20 items-center justify-between" aria-label="Main navigation">
        <Link
          href="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 rounded-md"
          onClick={closeMenu}
        >
          <WithCareLogo className="h-11 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 rounded-sm px-1 py-1',
                pathname === item.href ? 'text-coral-600' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" data-testid="nav-cta">
            <Link href="/waitlist" aria-label="Join the withCare waitlist">
              Join waitlist
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Navigation */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 md:hidden" 
              onClick={closeMenu}
              aria-hidden="true"
            />
            
            {/* Menu */}
            <div
              id="mobile-menu"
              className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-full max-w-sm border-l bg-background p-6 shadow-lg md:hidden"
              role="menu"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
                      pathname === item.href ? 'bg-accent text-accent-foreground' : ''
                    )}
                    onClick={closeMenu}
                    role="menuitem"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button asChild className="mt-4" data-testid="mobile-nav-cta">
                  <Link href="/waitlist" onClick={closeMenu} aria-label="Join the withCare waitlist">
                    Join waitlist
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}