import { describe, it, expect } from 'vitest'
import { selectRecommendations } from '../recommendations'
import { scoreAssessment } from '../scoring'
import { RECOMMENDATIONS } from '@/app/assessment/quiz-data'
import type { Letter } from '../types'

function allAnswers(letter: Letter): Record<number, Letter> {
  const answers: Record<number, Letter> = {}
  for (let i = 1; i <= 16; i++) answers[i] = letter
  return answers
}

describe('selectRecommendations', () => {
  it('stage B, no signals → returns up to 5 B-applicable recommendations', () => {
    const answers = allAnswers('B')
    const scoring = scoreAssessment(answers)
    const recs = selectRecommendations(RECOMMENDATIONS, 'B', [], answers, [], scoring, 5)
    expect(recs.length).toBeGreaterThan(0)
    expect(recs.length).toBeLessThanOrEqual(5)
    // All returned recs should be applicable to B (or universal)
    for (const rec of recs) {
      expect(!rec.stages || rec.stages.includes('B')).toBe(true)
    }
  })

  it('stage B + carrying_heavy_load → self-care resource is boosted (appears in results)', () => {
    const answers = allAnswers('B')
    const scoring = scoreAssessment(answers)
    const recs = selectRecommendations(
      RECOMMENDATIONS,
      'B',
      ['carrying_heavy_load'],
      answers,
      [],
      scoring,
      5
    )
    const ids = recs.map((r) => r.id)
    expect(ids).toContain('rec-self-care')
  })

  it('stage B + doing_it_without_backup → community resource boosted (appears in results)', () => {
    const answers = allAnswers('B')
    const scoring = scoreAssessment(answers)
    const recs = selectRecommendations(
      RECOMMENDATIONS,
      'B',
      ['doing_it_without_backup'],
      answers,
      [],
      scoring,
      5
    )
    const ids = recs.map((r) => r.id)
    expect(ids).toContain('rec-pero-community')
  })

  it('same stage, different signals → different ranked output', () => {
    const answers = allAnswers('C')
    const scoring = scoreAssessment(answers)

    const recsWithHeavyLoad = selectRecommendations(
      RECOMMENDATIONS,
      'C',
      ['carrying_heavy_load'],
      answers,
      [],
      scoring,
      3
    )
    const recsWithCoordinator = selectRecommendations(
      RECOMMENDATIONS,
      'C',
      ['natural_care_coordinator'],
      answers,
      [],
      scoring,
      3
    )

    expect(recsWithHeavyLoad.map((r) => r.id)).not.toEqual(
      recsWithCoordinator.map((r) => r.id)
    )
  })

  it('relationshipContext child + stage B → child resource boosted', () => {
    const answers = allAnswers('B')
    const scoring = scoreAssessment(answers)
    const recs = selectRecommendations(
      RECOMMENDATIONS,
      'B',
      [],
      answers,
      ['child'],
      scoring,
      5
    )
    const ids = recs.map((r) => r.id)
    expect(ids).toContain('rec-child-needs')
  })

  it('result is always capped at maxResults', () => {
    const answers = allAnswers('C')
    const scoring = scoreAssessment(answers)
    const recs = selectRecommendations(RECOMMENDATIONS, 'C', [], answers, [], scoring, 3)
    expect(recs.length).toBeLessThanOrEqual(3)
  })

  it('universal recommendations (no stages) are included for any stage', () => {
    for (const letter of ['A', 'B', 'C', 'D', 'E'] as Letter[]) {
      const answers = allAnswers(letter)
      const scoring = scoreAssessment(answers)
      const recs = selectRecommendations(RECOMMENDATIONS, letter, [], answers, [], scoring, 10)
      const ids = recs.map((r) => r.id)
      // Universal recs should appear — at least one should be present
      const universalRecs = RECOMMENDATIONS.filter((r) => !r.stages)
      const hasUniversal = universalRecs.some((u) => ids.includes(u.id))
      expect(hasUniversal).toBe(true)
    }
  })
})
