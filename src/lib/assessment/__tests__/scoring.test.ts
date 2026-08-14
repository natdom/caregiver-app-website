import { describe, it, expect } from 'vitest'
import { scoreAssessment, isMixedPicture } from '../scoring'
import type { Letter } from '../types'

// Only these IDs count for stage scoring
const STAGE_IDS = [1, 3, 4, 5, 6, 7, 9, 11, 13, 14, 15, 16]
const NON_STAGE_IDS = [2, 8, 10, 12]

function allAnswers(letter: Letter): Record<number, Letter> {
  const answers: Record<number, Letter> = {}
  for (let i = 1; i <= 16; i++) answers[i] = letter
  return answers
}

function stageAnswers(pattern: Partial<Record<number, Letter>>): Record<number, Letter> {
  const answers: Record<number, Letter> = {}
  for (const id of STAGE_IDS) answers[id] = pattern[id] ?? 'A'
  return answers
}

describe('scoreAssessment', () => {
  it('all-A answers → primaryStage A', () => {
    const result = scoreAssessment(allAnswers('A'))
    expect(result.primaryStage).toBe('A')
    expect(result.stageCounts.A).toBe(12)
  })

  it('all-B answers → primaryStage B', () => {
    expect(scoreAssessment(allAnswers('B')).primaryStage).toBe('B')
  })

  it('all-C answers → primaryStage C', () => {
    expect(scoreAssessment(allAnswers('C')).primaryStage).toBe('C')
  })

  it('all-D answers → primaryStage D', () => {
    expect(scoreAssessment(allAnswers('D')).primaryStage).toBe('D')
  })

  it('all-E answers → primaryStage E', () => {
    expect(scoreAssessment(allAnswers('E')).primaryStage).toBe('E')
  })

  it('non-stage questions (Q2, Q8, Q10, Q12) do not affect stageCounts', () => {
    const answers: Record<number, Letter> = {}
    for (const id of STAGE_IDS) answers[id] = 'B'
    for (const id of NON_STAGE_IDS) answers[id] = 'D' // would be stage D if counted
    const result = scoreAssessment(answers)
    expect(result.primaryStage).toBe('B')
    expect(result.stageCounts.D).toBe(0)
    expect(result.totalScoredAnswers).toBe(12)
  })

  it('6A + 6B tie → primaryStage B (later stage wins tie)', () => {
    const answers: Record<number, Letter> = {}
    const ids = [...STAGE_IDS]
    ids.slice(0, 6).forEach((id) => (answers[id] = 'A'))
    ids.slice(6, 12).forEach((id) => (answers[id] = 'B'))
    const result = scoreAssessment(answers)
    expect(result.primaryStage).toBe('B')
  })

  it('7B + 5C → transitioning B→C', () => {
    const answers: Record<number, Letter> = {}
    const ids = [...STAGE_IDS]
    ids.slice(0, 7).forEach((id) => (answers[id] = 'B'))
    ids.slice(7, 12).forEach((id) => (answers[id] = 'C'))
    const result = scoreAssessment(answers)
    expect(result.primaryStage).toBe('B')
    expect(result.isTransitioning).toBe(true)
    expect(result.adjacentStage).toBe('C')
  })

  it('11B + 1C → NOT transitioning (gap > 2)', () => {
    const answers: Record<number, Letter> = {}
    const ids = [...STAGE_IDS]
    ids.slice(0, 11).forEach((id) => (answers[id] = 'B'))
    answers[ids[11]] = 'C'
    const result = scoreAssessment(answers)
    expect(result.primaryStage).toBe('B')
    expect(result.isTransitioning).toBe(false)
    expect(result.adjacentStage).toBeNull()
  })

  it('6B + 5D + 1C (non-adjacent) → NOT transitioning', () => {
    const answers: Record<number, Letter> = {}
    const ids = [...STAGE_IDS]
    ids.slice(0, 6).forEach((id) => (answers[id] = 'B'))
    ids.slice(6, 11).forEach((id) => (answers[id] = 'D'))
    answers[ids[11]] = 'C'
    const result = scoreAssessment(answers)
    expect(result.primaryStage).toBe('B')
    expect(result.isTransitioning).toBe(false)
    expect(result.adjacentStage).toBeNull()
  })

  it('partial answers (8 scored) → isTransitioning always false', () => {
    const answers: Record<number, Letter> = {}
    STAGE_IDS.slice(0, 5).forEach((id) => (answers[id] = 'B'))
    STAGE_IDS.slice(5, 8).forEach((id) => (answers[id] = 'C'))
    const result = scoreAssessment(answers)
    expect(result.isTransitioning).toBe(false)
    expect(result.totalScoredAnswers).toBe(8)
  })
})

describe('isMixedPicture', () => {
  it('6B + 5D + 1C → mixed picture (non-adjacent second peak ≥ 3)', () => {
    const answers: Record<number, Letter> = {}
    const ids = [...STAGE_IDS]
    ids.slice(0, 6).forEach((id) => (answers[id] = 'B'))
    ids.slice(6, 11).forEach((id) => (answers[id] = 'D'))
    answers[ids[11]] = 'C'
    const result = scoreAssessment(answers)
    expect(isMixedPicture(result)).toBe(true)
  })

  it('7B + 5C → NOT mixed picture (they are adjacent)', () => {
    const answers: Record<number, Letter> = {}
    const ids = [...STAGE_IDS]
    ids.slice(0, 7).forEach((id) => (answers[id] = 'B'))
    ids.slice(7).forEach((id) => (answers[id] = 'C'))
    const result = scoreAssessment(answers)
    expect(isMixedPicture(result)).toBe(false)
  })

  it('all-B answers → NOT mixed picture', () => {
    const result = scoreAssessment(allAnswers('B'))
    expect(isMixedPicture(result)).toBe(false)
  })
})
