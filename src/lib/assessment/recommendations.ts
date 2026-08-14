import type { Letter, Recommendation, RelationshipContext, SupportSignalId } from './types'
import type { ScoringResult } from './types'

export function selectRecommendations(
  pool: Recommendation[],
  stage: Letter,
  signals: SupportSignalId[],
  answers: Record<number, Letter>,
  relationshipContexts: RelationshipContext[],
  scoring: ScoringResult,
  maxResults = 5
): Recommendation[] {
  const adjacentStage = scoring.adjacentStage

  // Step 1: filter to applicable recommendations
  const applicable = pool.filter(
    (rec) => !rec.stages || rec.stages.includes(stage)
  )

  // Step 2: score each recommendation
  const scored = applicable.map((rec) => {
    let score = 0

    // Boost for matching support signals
    for (const signal of signals) {
      if (rec.boostSignals.includes(signal)) score += 2
    }

    // Boost for matching relationship context
    if (rec.relationshipContexts) {
      for (const ctx of relationshipContexts) {
        if (rec.relationshipContexts.includes(ctx)) score += 1
      }
    }

    // Small boost for adjacent stage relevance
    if (adjacentStage && rec.stages?.includes(adjacentStage)) score += 1

    return { rec, score }
  })

  // Step 3: sort by score descending, stable by insertion order on ties
  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, maxResults).map((s) => s.rec)
}
