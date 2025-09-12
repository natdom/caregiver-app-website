import { allPages } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'Our commitment to making Support Network accessible to all caregivers.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function AccessibilityPage() {
  const page = allPages.find(p => p.slug === 'accessibility')
  
  if (!page) {
    notFound()
  }

  const MDXContent = getMDXComponent(page.body.code)

  return (
    <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12">
            <div className="prose prose-lg prose-charcoal dark:prose-invert max-w-none">
              <MDXContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}