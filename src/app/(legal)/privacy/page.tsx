import { allPages } from 'contentlayer/generated'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your information at Support Network.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  const page = allPages.find(p => p.slug === 'privacy')
  
  if (!page) {
    notFound()
  }

  const MDXContent = getMDXComponent(page.body.code)

  return (
    <div className="bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 dark:from-slate-900 dark:via-sky-900 dark:to-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <MDXContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}