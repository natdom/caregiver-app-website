import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@/components/analytics'
import { SkipToContent } from '@/components/skip-to-content'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'withCare - A supportive space for caregivers of all kinds',
    template: '%s | withCare',
  },
  description: 'To make every caregiver\'s day a little lighter through connection, clarity, and care.',
  keywords: ['caregiving', 'support', 'community', 'healthcare', 'family', 'eldercare', 'disability'],
  authors: [{ name: 'withCare Team' }],
  creator: 'withCare',
  publisher: 'withCare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://support.network'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'withCare',
    title: 'withCare - A supportive space for caregivers of all kinds',
    description: 'To make every caregiver\'s day a little lighter through connection, clarity, and care.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'withCare - Caregiving Support Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'withCare - A supportive space for caregivers of all kinds',
    description: 'To make every caregiver\'s day a little lighter through connection, clarity, and care.',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipToContent />
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}