import type { Letter, ScoringResult } from './types'

const STAGE_QUESTION_IDS = new Set([1, 3, 4, 5, 6, 7, 9, 11, 13, 14, 15, 16])

export const stageOrder: Record<Letter, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 }

// Shared comparator: count descending, then later stage wins on tie.
// When tied, the later stage wins so recommendations err toward emerging needs.
export function rankStages(counts: Record<Letter, number>): Letter[] {
  return (['A', 'B', 'C', 'D', 'E'] as Letter[]).sort((a, b) => {
    const countDiff = counts[b] - counts[a]
    if (countDiff !== 0) return countDiff
    return stageOrder[b] - stageOrder[a]
  })
}

export function scoreAssessment(answers: Record<number, Letter>): ScoringResult {
  const counts: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 }
  let totalScoredAnswers = 0

  for (const [qIdStr, letter] of Object.entries(answers)) {
    if (STAGE_QUESTION_IDS.has(Number(qIdStr))) {
      counts[letter]++
      totalScoredAnswers++
    }
  }

  const ranked = rankStages(counts)
  const primaryStage = ranked[0]
  const secondStage = ranked[1]

  // Transition requires: neighbouring stages, ≤2 point gap, and enough answered
  const areNeighbours = Math.abs(stageOrder[primaryStage] - stageOrder[secondStage]) === 1
  const isTransitioning =
    areNeighbours &&
    Math.abs(counts[primaryStage] - counts[secondStage]) <= 2 &&
    totalScoredAnswers >= 10

  return {
    primaryStage,
    stageCounts: counts,
    isTransitioning,
    adjacentStage: isTransitioning ? secondStage : null,
    totalScoredAnswers,
  }
}

// Non-adjacent dominant second stage → genuinely mixed picture rather than a transition.
export function isMixedPicture(result: ScoringResult): boolean {
  const ranked = rankStages(result.stageCounts)
  const gap = Math.abs(stageOrder[ranked[0]] - stageOrder[ranked[1]])
  return gap > 1 && result.stageCounts[ranked[1]] >= 3
}
