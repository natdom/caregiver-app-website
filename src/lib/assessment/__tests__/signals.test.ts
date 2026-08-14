import { describe, it, expect } from 'vitest'
import { detectSignals } from '../signals'
import { scoreAssessment } from '../scoring'
import type { Letter } from '../types'

function allAnswers(letter: Letter): Record<number, Letter> {
  const answers: Record<number, Letter> = {}
  for (let i = 1; i <= 16; i++) answers[i] = letter
  return answers
}

describe('detectSignals', () => {
  it('Q10=D AND Q12=D → carrying_heavy_load fires', () => {
    const answers = allAnswers('C')
    answers[10] = 'D'
    answers[12] = 'D'
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    expect(signals.map((s) => s.id)).toContain('carrying_heavy_load')
  })

  it('Q10=C AND Q12=D → carrying_heavy_load does NOT fire', () => {
    const answers = allAnswers('C')
    answers[10] = 'C'
    answers[12] = 'D'
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    expect(signals.map((s) => s.id)).not.toContain('carrying_heavy_load')
  })

  it('Q8=D → doing_it_without_backup fires', () => {
    const answers = allAnswers('C')
    answers[8] = 'D'
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    expect(signals.map((s) => s.id)).toContain('doing_it_without_backup')
  })

  it('Q8=C → doing_it_without_backup does NOT fire', () => {
    const answers = allAnswers('C')
    answers[8] = 'C'
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    expect(signals.map((s) => s.id)).not.toContain('doing_it_without_backup')
  })

  it('Q13=C with enough C answers → natural_care_coordinator fires', () => {
    // Need at least 3 C answers in stage questions plus Q13=C
    const answers: Record<number, Letter> = {}
    for (let i = 1; i <= 16; i++) answers[i] = 'B'
    // Stage question IDs: 1,3,4,5,6,7,9,11,13,14,15,16 — set 4 of them to C
    ;[1, 3, 4, 5].forEach((id) => (answers[id] = 'C'))
    answers[13] = 'C' // also a stage question, so now 5 Cs total
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    expect(signals.map((s) => s.id)).toContain('natural_care_coordinator')
  })

  it('zero signals fire when all answers are B', () => {
    // All-B: Q10=B (not overwhelmed frequently), Q12=B (fairly easy self-care),
    // Q8=B (mostly supported), Q5=B (not E), stageCounts.A=0, stageCounts.E=0
    const answers = allAnswers('B')
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    expect(signals).toHaveLength(0)
  })

  it('multiple signals can fire simultaneously', () => {
    const answers: Record<number, Letter> = {}
    for (let i = 1; i <= 16; i++) answers[i] = 'C'
    answers[10] = 'D'
    answers[12] = 'D'
    answers[8] = 'D'
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    const ids = signals.map((s) => s.id)
    expect(ids).toContain('carrying_heavy_load')
    expect(ids).toContain('doing_it_without_backup')
    expect(ids.length).toBeGreaterThanOrEqual(2)
  })

  it('stageCounts.A >= 4 → planning_ahead fires', () => {
    const answers: Record<number, Letter> = {}
    for (let i = 1; i <= 16; i++) answers[i] = 'B'
    // Set 4 stage-scored questions to A: Q1, Q3, Q4, Q5
    ;[1, 3, 4, 5].forEach((id) => (answers[id] = 'A'))
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    expect(signals.map((s) => s.id)).toContain('planning_ahead')
  })

  it('Q5=E → navigating_change fires', () => {
    const answers = allAnswers('C')
    answers[5] = 'E'
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    expect(signals.map((s) => s.id)).toContain('navigating_change')
  })
})
