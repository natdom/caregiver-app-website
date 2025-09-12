import Link from 'next/link'
import { Heart, Github, Twitter, Linkedin } from 'lucide-react'

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Resources', href: '/resources' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
  social: [],
}

export function Footer() {
  return (
    <footer className="bg-neutral-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-coral-400" aria-hidden="true" />
              <span className="font-display font-bold text-xl text-white">Support Network</span>
            </Link>
            <p className="text-sm leading-6 text-neutral-200 max-w-sm">
              Making every caregiver's day a little lighter through connection, clarity, and care.
            </p>
          </div>

          {/* Navigation sections */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Navigation</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-neutral-200 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-neutral-200 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Newsletter signup */}
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Stay updated</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-200">
                Get the latest updates and caregiving resources.
              </p>
              <Link
                href="/newsletter"
                className="mt-6 inline-flex rounded-md bg-coral-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600"
              >
                Join our waitlist
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 border-t border-neutral-800 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-xs leading-5 text-neutral-400">
              &copy; {new Date().getFullYear()} Support Network. All rights reserved.
            </p>
            <p className="mt-4 text-xs leading-5 text-neutral-400 sm:mt-0">
              Contact: <a href="mailto:hello@support.network" className="hover:text-neutral-200">hello@support.network</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}