type AssessmentEvent =
  | 'assessment_started'
  | 'assessment_question_answered'
  | 'assessment_completed'
  | 'assessment_result_viewed'
  | 'assessment_signup_cta_clicked'
  | 'assessment_email_submitted'
  | 'assessment_email_success'
  | 'assessment_email_error'

type EventProps = Record<string, string | number | boolean>

export function trackAssessmentEvent(event: AssessmentEvent, props?: EventProps): void {
  if (typeof window !== 'undefined' && (window as Window & { plausible?: (e: string, o?: { props: EventProps }) => void }).plausible) {
    (window as Window & { plausible: (e: string, o?: { props: EventProps }) => void }).plausible(event, props ? { props } : undefined)
  }
}
