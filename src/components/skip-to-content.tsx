'use client'

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-neutral-700 focus:shadow-lg"
    >
      Skip to main content
    </a>
  )
}