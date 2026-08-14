import type { Letter, ScoringResult, SupportSignal, SupportSignalId } from './types'

const SIGNAL_DEFINITIONS: Record<SupportSignalId, SupportSignal> = {
  carrying_heavy_load: {
    id: 'carrying_heavy_load',
    label: 'Carrying a Heavy Load',
    description:
      'Your answers suggest caregiving is taking a significant toll on your energy and time for yourself. This is common — and it matters.',
  },
  doing_it_without_backup: {
    id: 'doing_it_without_backup',
    label: 'Doing It Without Backup',
    description:
      'It sounds like you have limited support from family or friends. Caregiving is hard enough with a team. Doing it largely alone is exhausting.',
  },
  natural_care_coordinator: {
    id: 'natural_care_coordinator',
    label: 'Natural Care Coordinator',
    description:
      'You\'ve built systems and routines to manage care — a skill that takes real effort to develop. Protecting those systems matters.',
  },
  planning_ahead: {
    id: 'planning_ahead',
    label: 'Planning Ahead',
    description:
      'You\'re thinking proactively about care before it becomes urgent. That mindset gives you and your loved one more choices later.',
  },
  navigating_change: {
    id: 'navigating_change',
    label: 'Navigating a Big Change',
    description:
      'Your caregiving situation is shifting — whether a transition is approaching or already underway. Change in caregiving can bring grief alongside relief.',
  },
}

export function detectSignals(
  answers: Record<number, Letter>,
  scoring: ScoringResult
): SupportSignal[] {
  const fired: SupportSignalId[] = []

  // Carrying a Heavy Load: frequently overwhelmed AND extremely difficult to make time for self
  if (answers[10] === 'D' && answers[12] === 'D') {
    fired.push('carrying_heavy_load')
  }

  // Doing It Without Backup: rarely supported by family or friends
  if (answers[8] === 'D') {
    fired.push('doing_it_without_backup')
  }

  // Natural Care Coordinator: organised care system + strong C answers
  if (
    (answers[13] === 'C' || answers[13] === 'D') &&
    scoring.stageCounts.C >= 3
  ) {
    fired.push('natural_care_coordinator')
  }

  // Planning Ahead: many A answers in the stage scoring
  if (scoring.stageCounts.A >= 4) {
    fired.push('planning_ahead')
  }

  // Navigating a Big Change: chose "adjusting to a new chapter" OR many E answers
  if (answers[5] === 'E' || scoring.stageCounts.E >= 3) {
    fired.push('navigating_change')
  }

  return fired.map((id) => SIGNAL_DEFINITIONS[id])
}
