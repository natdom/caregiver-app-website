type SplashEvent =
  | 'splash_shown'
  | 'splash_assessment_clicked'
  | 'splash_browse_clicked'
  | 'splash_dismissed'

type EventProps = Record<string, string | number | boolean>

export function trackSplashEvent(event: SplashEvent, props?: EventProps): void {
  if (typeof window !== 'undefined' && (window as Window & { plausible?: (e: string, o?: { props: EventProps }) => void }).plausible) {
    (window as Window & { plausible: (e: string, o?: { props: EventProps }) => void }).plausible(event, props ? { props } : undefined)
  }
}
