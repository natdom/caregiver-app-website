import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Heart, Users, Lightbulb, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Design tokens, components, and patterns used in Support Network.',
  robots: {
    index: false,
    follow: false,
  },
}

const colorPalette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    900: '#0f172a',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    900: '#064e3b',
  },
}

const spacing = {
  '1': '0.25rem',
  '2': '0.5rem',
  '4': '1rem',
  '6': '1.5rem',
  '8': '2rem',
  '12': '3rem',
  '16': '4rem',
  '24': '6rem',
}

export default function DesignSystemPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 dark:from-slate-900 dark:via-sky-900 dark:to-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Design System
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
              Components, tokens, and patterns for Support Network
            </p>
          </div>

          {/* Typography */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Typography</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Headings</h3>
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold text-slate-900 dark:text-white">Heading 1</h1>
                  <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Heading 2</h2>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Heading 3</h3>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Heading 4</h4>
                  <h5 className="text-xl font-bold text-slate-900 dark:text-white">Heading 5</h5>
                  <h6 className="text-lg font-bold text-slate-900 dark:text-white">Heading 6</h6>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Body Text</h3>
                <p className="text-base text-slate-600 dark:text-slate-300 mb-4">
                  This is regular body text. Support Network is designed to be warm, approachable, and professional. 
                  We use clear, direct language that respects caregivers' time and emotional bandwidth.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                  This is large body text, used for important introductory content or emphasis.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This is small text, used for captions, metadata, and secondary information.
                </p>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Color Palette</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {Object.entries(colorPalette).map(([name, colors]) => (
                <div key={name}>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 capitalize">{name}</h3>
                  <div className="space-y-2">
                    {Object.entries(colors).map(([shade, hex]) => (
                      <div key={shade} className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-700"
                          style={{ backgroundColor: hex }}
                        />
                        <div className="text-sm">
                          <div className="font-mono text-slate-900 dark:text-white">{shade}</div>
                          <div className="text-slate-500 dark:text-slate-400">{hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Spacing */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Spacing Scale</h2>
            <div className="space-y-4">
              {Object.entries(spacing).map(([name, value]) => (
                <div key={name} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-mono text-slate-600 dark:text-slate-400">{name}</div>
                  <div className="w-24 text-sm text-slate-500 dark:text-slate-400">{value}</div>
                  <div 
                    className="bg-sky-200 dark:bg-sky-800 h-4"
                    style={{ width: value }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Icons */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Icons</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We use Lucide React icons for their clarity and consistency.
            </p>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <Heart className="h-8 w-8 text-sky-500 mx-auto mb-2" />
                <div className="text-sm text-slate-600 dark:text-slate-400">Heart</div>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-sm text-slate-600 dark:text-slate-400">Users</div>
              </div>
              <div className="text-center">
                <Lightbulb className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <div className="text-sm text-slate-600 dark:text-slate-400">Lightbulb</div>
              </div>
              <div className="text-center">
                <Mail className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <div className="text-sm text-slate-600 dark:text-slate-400">Mail</div>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Buttons</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Sizes</h3>
                <div className="flex items-end gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Form Elements */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Form Elements</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="demo-input">Input Field</Label>
                  <Input id="demo-input" placeholder="Enter your name" />
                </div>
                <div>
                  <Label htmlFor="demo-textarea">Textarea</Label>
                  <Textarea id="demo-textarea" placeholder="Tell us about your caregiving experience..." />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="demo-checkbox" />
                  <Label htmlFor="demo-checkbox">I agree to the terms and conditions</Label>
                </div>
                <div>
                  <Label className="text-sm font-medium">States</Label>
                  <div className="space-y-2 mt-2">
                    <Input placeholder="Default state" />
                    <Input placeholder="Focus state" className="ring-2 ring-sky-500 ring-offset-2" />
                    <Input placeholder="Error state" className="border-red-500" />
                    <Input placeholder="Disabled state" disabled />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Cards</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Basic Card</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  This is a basic card component with standard padding and border.
                </p>
              </div>
              <div className="bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Gradient Card</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  This card uses a subtle gradient background for emphasis.
                </p>
              </div>
            </div>
          </section>

          {/* Motion & Animation */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Motion & Animation</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Transition Timing</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  We use subtle, purposeful animations that respect users who prefer reduced motion.
                </p>
                <div className="flex items-center space-x-4">
                  <Button className="transition-transform hover:scale-105">Hover me</Button>
                  <div className="text-sm text-slate-500 dark:text-slate-400">hover:scale-105 transition</div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Reduced Motion</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  All animations respect the <code>prefers-reduced-motion</code> media query for accessibility.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}