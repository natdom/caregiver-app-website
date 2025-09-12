'use client'

interface PlausibleEventProps {
  [key: string]: string | number | boolean
}

interface PlausibleArgs {
  callback?: () => void
  props?: PlausibleEventProps
}

declare global {
  interface Window {
    plausible?: (
      event: string,
      args?: PlausibleArgs
    ) => void
  }
}

export type AnalyticsEvent = 
  | 'waitlist_submit'
  | 'newsletter_subscribe'
  | 'resource_read'
  | 'contact_submit'
  | 'resource_view'
  | 'about_view'
  | 'press_view'

export function trackEvent(
  event: AnalyticsEvent,
  props?: PlausibleEventProps,
  callback?: () => void
) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, { props, callback })
  } else if (callback) {
    // If Plausible isn't available, still execute callback
    callback()
  }
}

export function useAnalytics() {
  const track = (
    event: AnalyticsEvent,
    props?: PlausibleEventProps,
    callback?: () => void
  ) => {
    trackEvent(event, props, callback)
  }

  return { track }
}

// Convenience functions for common events
export const analytics = {
  waitlistSubmit: (role?: string) => 
    trackEvent('waitlist_submit', role ? { role } : {}),
    
  newsletterSubscribe: (source?: string) =>
    trackEvent('newsletter_subscribe', source ? { source } : {}),
    
  resourceRead: (title: string, category?: string) =>
    trackEvent('resource_read', category ? { title, category } : { title }),
    
  contactSubmit: (role?: string) =>
    trackEvent('contact_submit', role ? { role } : {}),
    
  resourceView: (title: string, slug: string) =>
    trackEvent('resource_view', { title, slug }),
    
  pageView: (page: string) =>
    trackEvent(page as AnalyticsEvent),
}