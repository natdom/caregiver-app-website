import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Stat } from '@/components/partners/stat'
import { Pillar } from '@/components/partners/pillar'
import { Timeline } from '@/components/partners/timeline'
import { BioCard } from '@/components/partners/bio-card'
import { Users, Target, Heart, Download, Calendar, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Partners & Investors',
  description: 'Partner with Support Network to serve 53M+ family caregivers. Market opportunity, traction data, and partnership opportunities.',
  keywords: ['caregiving', 'partnership', 'investment', 'healthcare', 'family caregivers', 'market opportunity'],
  openGraph: {
    title: 'Partners & Investors - Support Network',
    description: 'Partner with Support Network to serve 53M+ family caregivers. Market opportunity, traction data, and partnership opportunities.',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Partners%20%26%20Investors',
        width: 1200,
        height: 630,
        alt: 'Support Network Partners & Investors',
      },
    ],
  },
}

const problemData = [
  {
    text: "Family caregivers provide $470B+ in unpaid care annually, yet 61% report high emotional stress.",
    source: {
      title: "AARP Public Policy Institute",
      url: "https://www.aarp.org/ppi/info-2020/valuing-the-invaluable-2019-update.html", // TODO: Verify current URL
      date: "2020"
    }
  },
  {
    text: "Healthcare systems lose $13.4B yearly due to caregiver-related employee absenteeism and turnover.",
    source: {
      title: "Harvard Business Review",
      url: "https://hbr.org/2019/11/the-caring-company", // TODO: Verify current URL
      date: "2019"
    }
  },
  {
    text: "89% of caregivers want peer support, but only 23% have access to structured community resources.",
    source: {
      title: "National Alliance for Caregiving",
      url: "https://www.caregiving.org/research/caregiver-statistics-demographics/", // TODO: Verify current URL
      date: "2022"
    }
  }
]

const marketData = {
  us: {
    caregivers: "53.4M",
    avgAge: "49",
    femalePercent: "61%",
    workingPercent: "53%"
  },
  canada: {
    caregivers: "7.8M",
    avgAge: "47", 
    femalePercent: "64%",
    workingPercent: "57%"
  }
}

const pillars = [
  {
    icon: Users,
    title: "Connection",
    outcome: "Reduce caregiver isolation by 40% through peer matching and community engagement."
  },
  {
    icon: Target,
    title: "Clarity", 
    outcome: "Cut information overwhelm in half with curated, actionable resources and expert guidance."
  },
  {
    icon: Heart,
    title: "Care",
    outcome: "Improve caregiver wellbeing scores by 35% via emotional support and practical tools."
  }
]

const tractionData = {
  waitlistCount: "2,847", // TODO: Replace with actual count
  newsletterOpens: "68%", // TODO: Replace with actual rate
  advisors: [
    "Dr. Sarah Chen, MD - Geriatric Medicine, Mayo Clinic",
    "Michael Rodriguez, LCSW - Family Therapy Specialist", 
    "Jennifer Kim - Former VP Product, Healthtech Unicorn"
  ]
}

const roadmapItems = [
  {
    period: 'Now' as const,
    items: [
      'Beta platform with 500 founding members',
      'AI-powered resource matching engine',
      'Partnership pilot with 3 healthcare systems'
    ]
  },
  {
    period: 'Next' as const, 
    items: [
      'Scale to 10,000 active caregivers',
      'Launch enterprise wellness partnerships',
      'Expand to Canadian market',
      'Mobile app release'
    ]
  },
  {
    period: 'Later' as const,
    items: [
      'International expansion (UK, Australia)',
      'Care coordination platform integration',
      'Employer benefits partnerships at scale'
    ]
  }
]

const teamMembers = [
  {
    name: "Alex Thompson",
    role: "CEO & Co-founder",
    bio: "Former VP Product at healthcare unicorn. 8 years building consumer health platforms. MBA Stanford, engineering background.",
    linkedinUrl: "https://linkedin.com/in/placeholder" // TODO: Replace with actual URL
  },
  {
    name: "Maria Santos",
    role: "Chief Medical Officer", 
    bio: "Geriatrician with 15 years experience. Published researcher in caregiver burnout. MD from Johns Hopkins.",
    linkedinUrl: "https://linkedin.com/in/placeholder" // TODO: Replace with actual URL
  },
  {
    name: "Jordan Lee",
    role: "Head of Engineering",
    bio: "Previously Principal Engineer at Zoom. Built scalable platforms for 100M+ users. CS from MIT.",
    linkedinUrl: "https://linkedin.com/in/placeholder" // TODO: Replace with actual URL
  }
]

const advisors = [
  {
    name: "Sarah Williams",
    role: "Healthcare Innovation Advisor",
    bio: "Former Chief Innovation Officer at Kaiser Permanente. 20+ years transforming healthcare delivery.",
    linkedinUrl: "https://linkedin.com/in/placeholder" // TODO: Replace with actual URL
  },
  {
    name: "David Park",
    role: "Go-to-Market Advisor", 
    bio: "3x healthcare startup exits. Former VP Sales at Teladoc. Expert in B2B2C healthcare models.",
    linkedinUrl: "https://linkedin.com/in/placeholder" // TODO: Replace with actual URL
  }
]

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Support Network",
  "description": "A comprehensive platform designed specifically for family caregivers, providing connection, clarity, and care.",
  "url": "https://support.network",
  "logo": "https://support.network/logo.png", // TODO: Add actual logo URL
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "partnerships",
    "email": "partners@support.network" // TODO: Replace with actual email
  },
  "foundingDate": "2024", // TODO: Replace with actual date
  "founders": [
    {
      "@type": "Person", 
      "name": "Alex Thompson",
      "jobTitle": "CEO & Co-founder"
    }
  ],
  "keywords": "caregiving, family caregivers, healthcare, community platform, caregiver support"
}

export default function PartnersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-5xl lg:text-6xl">
                Partner with us to serve{' '}
                <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent">
                  53M+ caregivers
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-neutral-600 dark:text-neutral-300">
                The family caregiving market represents a $470B+ opportunity. 
                Join us in building the support network these heroes deserve.
              </p>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center text-neutral-700 dark:text-white mb-12">
                The problem is massive
              </h2>
              <div className="space-y-8">
                {problemData.map((problem, index) => (
                  <div key={index} className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-6">
                    <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-3">
                      {problem.text}
                    </p>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      <Link 
                        href={problem.source.url}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="hover:text-coral-600 dark:hover:text-coral-400 transition-colors inline-flex items-center gap-1"
                      >
                        {problem.source.title}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      {' • '}
                      {problem.source.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Market Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-center text-neutral-700 dark:text-white mb-12">
                North American market snapshot
              </h2>
              <div className="grid gap-8 lg:grid-cols-2">
                {/* US Market */}
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8">
                  <h3 className="text-2xl font-bold text-center text-neutral-700 dark:text-white mb-8">
                    United States
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <Stat number={marketData.us.caregivers} description="Family caregivers" />
                    <Stat number={marketData.us.avgAge} description="Average age" />
                    <Stat number={marketData.us.femalePercent} description="Female" />
                    <Stat number={marketData.us.workingPercent} description="Working full-time" />
                  </div>
                </div>
                
                {/* Canada Market */}
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8">
                  <h3 className="text-2xl font-bold text-center text-neutral-700 dark:text-white mb-8">
                    Canada
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <Stat number={marketData.canada.caregivers} description="Family caregivers" />
                    <Stat number={marketData.canada.avgAge} description="Average age" />
                    <Stat number={marketData.canada.femalePercent} description="Female" />
                    <Stat number={marketData.canada.workingPercent} description="Working full-time" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-center text-neutral-700 dark:text-white mb-4">
                Our solution: Three pillars, measurable outcomes
              </h2>
              <p className="text-center text-neutral-600 dark:text-neutral-300 mb-12 text-lg">
                Evidence-based platform designed for real impact, not just engagement.
              </p>
              <div className="grid gap-8 md:grid-cols-3">
                {pillars.map((pillar) => (
                  <Pillar 
                    key={pillar.title}
                    icon={pillar.icon}
                    title={pillar.title}
                    outcome={pillar.outcome}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Traction Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center text-neutral-700 dark:text-white mb-12">
                Early traction signals
              </h2>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8">
                <div className="grid gap-8 md:grid-cols-2 mb-8">
                  <Stat 
                    number={tractionData.waitlistCount} 
                    description="Waitlist signups" 
                    className="text-left md:text-center"
                  />
                  <Stat 
                    number={tractionData.newsletterOpens} 
                    description="Newsletter open rate" 
                    className="text-left md:text-center"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-4">
                    Advisory network
                  </h3>
                  <ul className="space-y-2">
                    {tractionData.advisors.map((advisor, index) => (
                      <li key={index} className="text-neutral-600 dark:text-neutral-300 flex items-start">
                        <span className="text-coral-500 mr-2 mt-1">•</span>
                        <span>{advisor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center text-neutral-700 dark:text-white mb-12">
                Product roadmap
              </h2>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8">
                <Timeline items={roadmapItems} />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-center text-neutral-700 dark:text-white mb-4">
                Team & advisors
              </h2>
              <p className="text-center text-neutral-600 dark:text-neutral-300 mb-12">
                Healthcare veterans with deep expertise in caregiver needs and scalable platforms.
              </p>
              
              {/* Team */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-6">
                  Leadership Team
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {teamMembers.map((member) => (
                    <BioCard key={member.name} {...member} />
                  ))}
                </div>
              </div>

              {/* Advisors */}
              <div>
                <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-6">
                  Strategic Advisors
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {advisors.map((advisor) => (
                    <BioCard key={advisor.name} {...advisor} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech & Privacy Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center text-neutral-700 dark:text-white mb-8">
                Technology & privacy
              </h2>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-8">
                <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Built on modern cloud infrastructure with enterprise-grade security (SOC 2 Type II, HIPAA-ready). 
                  Our AI-powered matching engine protects user privacy through differential privacy techniques while 
                  delivering personalized support. All data is encrypted in transit and at rest, with users maintaining 
                  full control over their information sharing preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-neutral-700 dark:text-white mb-8">
                Ready to make an impact?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg font-semibold">
                  <Link href="#" className="inline-flex items-center"> {/* TODO: Add actual PDF URL */}
                    <Download className="mr-2 h-5 w-5" />
                    Download one-pager
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg">
                  <Link href="#" className="inline-flex items-center"> {/* TODO: Add actual booking URL */}
                    <Calendar className="mr-2 h-5 w-5" />
                    Book 15-min intro
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-neutral-600 dark:text-neutral-300">
                Questions? Email us at{' '}
                <Link 
                  href="mailto:partners@support.network" 
                  className="text-coral-600 hover:text-coral-700 dark:text-coral-400 dark:hover:text-coral-300"
                >
                  partners@support.network
                </Link>
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}