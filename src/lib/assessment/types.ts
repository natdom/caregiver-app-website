export type Letter = 'A' | 'B' | 'C' | 'D' | 'E'

export type RelationshipContext =
  | 'aging_parent'
  | 'partner'
  | 'child'
  | 'friend_family'
  | 'preparing'

export type Question = {
  id: number
  text: string
  options: { letter: Letter; text: string }[]
  countsForStage: boolean
}

export type Stage = {
  letter: Letter
  displayName: string
  internalName: string
  season: string
  description: string
  strength: { headline: string; body: string }
  awareness: { headline: string; body: string }
  nextStep: string
  crmTag: string
}

export type ScoringResult = {
  primaryStage: Letter
  stageCounts: Record<Letter, number>
  isTransitioning: boolean
  adjacentStage: Letter | null
  totalScoredAnswers: number
}

export type SupportSignalId =
  | 'carrying_heavy_load'
  | 'doing_it_without_backup'
  | 'natural_care_coordinator'
  | 'planning_ahead'
  | 'navigating_change'

export type SupportSignal = {
  id: SupportSignalId
  label: string
  description: string
}

export type Recommendation = {
  id: string
  title: string
  description: string
  href: string
  type: 'resource' | 'community' | 'tool' | 'guide'
  reason: string
  stages?: Letter[]
  boostSignals: SupportSignalId[]
  relationshipContexts?: RelationshipContext[]
}

export type AssessmentResult = {
  scoring: ScoringResult
  signals: SupportSignal[]
  recommendations: Recommendation[]
}
