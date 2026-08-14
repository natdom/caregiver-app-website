'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Mail, BookOpen, Users, Wrench, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { scoreAssessment, isMixedPicture } from '@/lib/assessment/scoring'
import { detectSignals } from '@/lib/assessment/signals'
import { selectRecommendations } from '@/lib/assessment/recommendations'
import { trackAssessmentEvent } from '@/lib/assessment/analytics'
import { QUESTIONS, STAGES, RECOMMENDATIONS } from './quiz-data'
import type { Letter, RelationshipContext, AssessmentResult } from '@/lib/assessment/types'

type View = 'intro' | 'context' | 'question' | 'results' | 'lead'

const STAGE_ORDER: Letter[] = ['A', 'B', 'C', 'D', 'E']

const RELATIONSHIP_OPTIONS: { value: RelationshipContext; label: string }[] = [
  { value: 'aging_parent', label: 'A parent, grandparent, or older family member' },
  { value: 'partner', label: 'A partner or spouse' },
  { value: 'child', label: 'A child or young person' },
  { value: 'friend_family', label: 'Another family member or friend' },
  { value: 'preparing', label: "I'm preparing for a future caregiving role" },
]

type RecType = 'resource' | 'community' | 'tool' | 'guide'

const TYPE_ICONS: Record<RecType, React.ReactNode> = {
  resource: <BookOpen className="h-3 w-3" aria-hidden="true" />,
  community: <Users className="h-3 w-3" aria-hidden="true" />,
  tool: <Wrench className="h-3 w-3" aria-hidden="true" />,
  guide: <FileText className="h-3 w-3" aria-hidden="true" />,
}

function useReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function AssessmentClient() {
  const [view, setView] = useState<View>('intro')
  const [contextSelections, setContextSelections] = useState<RelationshipContext[]>([])
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<number, Letter>>({})
  const [result, setResult] = useState<AssessmentResult | null>(null)

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [emailError, setEmailError] = useState('')

  const questionHeadingRef = useRef<HTMLHeadingElement>(null)
  const leadSectionRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const transition = reducedMotion ? '' : 'transition-all duration-300'

  const focusQuestionHeading = useCallback(() => {
    // Brief delay to let the DOM update before focusing
    setTimeout(() => questionHeadingRef.current?.focus(), 50)
  }, [])

  function handleBegin() {
    trackAssessmentEvent('assessment_started')
    setView('context')
  }

  function toggleContext(value: RelationshipContext) {
    setContextSelections((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  function handleContextNext() {
    setView('question')
    setStep(1)
    focusQuestionHeading()
  }

  function handleAnswerSelect(letter: Letter) {
    setAnswers((prev) => ({ ...prev, [step]: letter }))
    trackAssessmentEvent('assessment_question_answered', { question_number: step })
  }

  function handleNext() {
    if (!answers[step]) return
    if (step < 16) {
      setStep((s) => s + 1)
      focusQuestionHeading()
    } else {
      computeResults()
    }
  }

  function handleBack() {
    if (view === 'question' && step === 1) {
      setView('context')
    } else if (view === 'question' && step > 1) {
      setStep((s) => s - 1)
      focusQuestionHeading()
    }
  }

  function computeResults() {
    const scoring = scoreAssessment(answers)
    const signals = detectSignals(answers, scoring)
    const recommendations = selectRecommendations(
      RECOMMENDATIONS,
      scoring.primaryStage,
      signals.map((s) => s.id),
      answers,
      contextSelections,
      scoring,
      3
    )
    const assessmentResult: AssessmentResult = { scoring, signals, recommendations }
    setResult(assessmentResult)
    setView('results')
    trackAssessmentEvent('assessment_completed', {
      primary_stage: scoring.primaryStage,
      is_transitioning: scoring.isTransitioning,
      mixed_picture: isMixedPicture(scoring),
    })
    trackAssessmentEvent('assessment_result_viewed')
  }

  function handleRestart() {
    setView('intro')
    setStep(1)
    setAnswers({})
    setContextSelections([])
    setResult(null)
    setEmailStatus('idle')
    setEmail('')
    setFirstName('')
    setEmailError('')
  }

  function handleSignupCTA() {
    trackAssessmentEvent('assessment_signup_cta_clicked', {
      primary_stage: result?.scoring.primaryStage ?? '',
    })
    leadSectionRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    setEmailError('')
    trackAssessmentEvent('assessment_email_submitted', {
      primary_stage: result?.scoring.primaryStage ?? '',
    })

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: firstName || undefined,
          source: 'assessment',
          assessmentStage: result?.scoring.primaryStage,
        }),
      })

      if (!res.ok) throw new Error('api_error')

      setEmailStatus('success')
      trackAssessmentEvent('assessment_email_success', {
        primary_stage: result?.scoring.primaryStage ?? '',
      })
    } catch {
      setEmailStatus('error')
      setEmailError('Something went wrong. Please try again.')
      trackAssessmentEvent('assessment_email_error', { error_type: 'api_error' })
    }
  }

  // ─── Views ───────────────────────────────────────────────────────────────────

  if (view === 'intro') return <IntroView onBegin={handleBegin} />

  if (view === 'context') {
    return (
      <ContextView
        selections={contextSelections}
        onToggle={toggleContext}
        onNext={handleContextNext}
        transition={transition}
      />
    )
  }

  if (view === 'question') {
    const question = QUESTIONS[step - 1]
    return (
      <QuestionView
        question={question}
        step={step}
        total={QUESTIONS.length}
        selectedAnswer={answers[step]}
        onSelect={handleAnswerSelect}
        onNext={handleNext}
        onBack={handleBack}
        questionHeadingRef={questionHeadingRef}
        transition={transition}
      />
    )
  }

  if (view === 'results' && result) {
    const stage = STAGES[result.scoring.primaryStage]
    const mixed = isMixedPicture(result.scoring)
    const adjacentStage = result.scoring.adjacentStage
      ? STAGES[result.scoring.adjacentStage]
      : null

    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-2xl">

            {/* Stage header */}
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-coral-100 px-4 py-1.5 text-sm font-medium text-coral-700 dark:bg-coral-900/30 dark:text-coral-300">
                {stage.displayName}
              </span>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{stage.internalName}</p>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-3xl">
                {stage.season}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                {stage.description}
              </p>
            </div>

            {/* Journey path dots */}
            <div
              className="mt-8 flex items-center justify-center gap-2"
              role="img"
              aria-label={`You are at stage: ${stage.displayName}`}
            >
              {STAGE_ORDER.map((letter, i) => {
                const s = STAGES[letter]
                const isActive = letter === result.scoring.primaryStage
                const isAdjacent = letter === adjacentStage?.letter
                return (
                  <div key={letter} className="flex items-center">
                    {i > 0 && (
                      <div className="mx-1 h-px w-5 bg-neutral-300 dark:bg-neutral-600" />
                    )}
                    <div
                      className={`rounded-full ${transition} ${
                        isActive
                          ? 'h-4 w-4 bg-coral-500 ring-4 ring-coral-500/20'
                          : isAdjacent
                          ? 'h-3 w-3 bg-coral-300 dark:bg-coral-700'
                          : 'h-3 w-3 bg-neutral-200 dark:bg-neutral-700'
                      }`}
                      title={s.displayName}
                    />
                  </div>
                )
              })}
            </div>

            {/* Transition / mixed picture callout */}
            {result.scoring.isTransitioning && adjacentStage && (
              <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3 text-center text-sm text-teal-700 dark:border-teal-800 dark:bg-teal-900/20 dark:text-teal-300">
                Your answers suggest you&apos;re moving from{' '}
                <strong>{stage.displayName}</strong> into{' '}
                <strong>{adjacentStage.displayName}</strong>.
              </div>
            )}
            {mixed && !result.scoring.isTransitioning && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-center text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                Your answers span different parts of the caregiving journey. That&apos;s common — different
                parts of caregiving don&apos;t always move together.
              </div>
            )}

            {/* Strength + Something to Watch */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-800 dark:bg-teal-900/20">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
                  Your Strength
                </p>
                <p className="mb-1 text-base font-semibold text-neutral-700 dark:text-white">
                  {stage.strength.headline}
                </p>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {stage.strength.body}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  Something to Watch
                </p>
                <p className="mb-1 text-base font-semibold text-neutral-700 dark:text-white">
                  {stage.awareness.headline}
                </p>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {stage.awareness.body}
                </p>
              </div>
            </div>

            {/* Suggested next step */}
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white/50 px-5 py-4 dark:border-white/10 dark:bg-white/5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                A good next step
              </p>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                {stage.nextStep}
              </p>
            </div>

            {/* Signal cards */}
            {result.signals.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  What we noticed
                </p>
                <div className="space-y-3">
                  {result.signals.map((signal) => (
                    <div
                      key={signal.id}
                      className="rounded-xl border border-neutral-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <p className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-200">
                        {signal.label}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {signal.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  Resources for where you are
                </p>
                <div className="space-y-3">
                  {result.recommendations.map((rec) => (
                    <Link
                      key={rec.id}
                      href={rec.href}
                      className={`group block rounded-2xl border border-neutral-100 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5 ${transition} hover:border-neutral-200 hover:bg-white hover:shadow-md dark:hover:bg-white/10`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium capitalize text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                              {TYPE_ICONS[rec.type as RecType]}
                              {rec.type}
                            </span>
                          </div>
                          <p className="text-base font-semibold text-neutral-700 dark:text-white">
                            {rec.title}
                          </p>
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                            {rec.description}
                          </p>
                          <p className="mt-1.5 text-xs italic text-neutral-400 dark:text-neutral-500">
                            {rec.reason}
                          </p>
                        </div>
                        <ArrowRight
                          className={`mt-1 h-4 w-4 flex-shrink-0 text-teal-500 ${transition} group-hover:translate-x-1`}
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
              This is a self-reflection tool, not a clinical assessment. Your results reflect today
              — caregiving situations change, and you can retake this anytime.
            </p>

            {/* CTA → lead capture */}
            <div className="mt-8 text-center">
              <Button
                size="lg"
                onClick={handleSignupCTA}
                className={`shadow-lg ${transition} hover:scale-105 hover:shadow-xl`}
              >
                Stay connected to your caregiving journey →
              </Button>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                Join pero&apos;s early community · No spam · Unsubscribe anytime
              </p>
            </div>

            {/* Lead capture section */}
            <div ref={leadSectionRef} className="mt-12">
              <LeadCapture
                stage={stage.displayName}
                firstName={firstName}
                email={email}
                status={emailStatus}
                errorMessage={emailError}
                onFirstNameChange={setFirstName}
                onEmailChange={setEmail}
                onSubmit={handleEmailSubmit}
                transition={transition}
              />
            </div>

            {/* Restart */}
            <div className="mt-8 text-center">
              <button
                onClick={handleRestart}
                className="text-sm text-neutral-400 underline-offset-2 hover:text-neutral-600 hover:underline dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                Retake the assessment
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  }

  return null
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function IntroView({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex min-h-screen items-center overflow-x-hidden bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-white/10 sm:p-10">
            <div className="text-center">
              <span className="inline-block rounded-full bg-white/40 px-3 py-1 text-sm text-neutral-600 dark:text-neutral-300">
                3 minutes · 16 questions · Free
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-neutral-700 dark:text-white sm:text-4xl">
                Where are you in your{' '}
                <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text font-display text-transparent">
                  caregiving journey?
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                Caregiving isn&apos;t a single event — it&apos;s a journey that evolves over time. This
                assessment will help you understand where you are today, what strengths you already
                have, and what support may help as your situation changes.
              </p>
              <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                There are no right or wrong answers. Simply choose the response that feels most true
                for you.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  onClick={onBegin}
                  className="text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  Begin →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContextView({
  selections,
  onToggle,
  onNext,
  transition,
}: {
  selections: RelationshipContext[]
  onToggle: (v: RelationshipContext) => void
  onNext: () => void
  transition: string
}) {
  return (
    <div className="flex min-h-screen items-center overflow-x-hidden bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-white/10">
            <h2 className="text-xl font-semibold text-neutral-700 dark:text-white">
              To help personalize your results — who are you supporting?
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Select all that apply. This won&apos;t change your result, but helps us tailor recommendations.
            </p>

            <div className="mt-6 space-y-3" role="group" aria-label="Who are you supporting?">
              {RELATIONSHIP_OPTIONS.map((opt) => {
                const checked = selections.includes(opt.value)
                return (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${transition} ${
                      checked
                        ? 'border-teal-500 bg-teal-50/80 dark:border-teal-600 dark:bg-teal-900/30'
                        : 'border-neutral-200 bg-white/60 hover:border-teal-200 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-700 dark:hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(opt.value)}
                      className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-neutral-600"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-200">{opt.label}</span>
                  </label>
                )
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={onNext}
                className="text-sm text-neutral-400 underline-offset-2 hover:text-neutral-600 hover:underline dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                Skip this step →
              </button>
              <Button onClick={onNext}>
                {selections.length > 0 ? 'Continue →' : 'Skip →'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuestionView({
  question,
  step,
  total,
  selectedAnswer,
  onSelect,
  onNext,
  onBack,
  questionHeadingRef,
  transition,
}: {
  question: (typeof QUESTIONS)[0]
  step: number
  total: number
  selectedAnswer: Letter | undefined
  onSelect: (l: Letter) => void
  onNext: () => void
  onBack: () => void
  questionHeadingRef: React.RefObject<HTMLHeadingElement>
  transition: string
}) {
  const progress = (step / total) * 100

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-coral-50 via-sage-50 to-coral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-white/10 sm:p-8">

            {/* Progress */}
            <div className="mb-6">
              <div
                aria-live="polite"
                className="mb-2 text-sm text-neutral-500 dark:text-neutral-400"
              >
                Question {step} of {total}
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-coral-500 to-teal-500 ${transition}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question heading — receives focus on step change */}
            <h2
              ref={questionHeadingRef}
              tabIndex={-1}
              className="mb-6 text-xl font-semibold text-neutral-700 outline-none dark:text-white"
            >
              {question.text}
            </h2>

            {/* Answer options */}
            <fieldset>
              <legend className="sr-only">{question.text}</legend>
              <ul role="radiogroup" className="space-y-3">
                {question.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.letter
                  return (
                    <li key={opt.letter}>
                      <label
                        className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border p-4 ${transition} ${
                          isSelected
                            ? 'border-coral-500 bg-coral-50/80 ring-2 ring-coral-500/20 dark:border-coral-600 dark:bg-coral-900/30 dark:ring-coral-700/30'
                            : 'border-neutral-200 bg-white/50 hover:border-neutral-300 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={opt.letter}
                          checked={isSelected}
                          onChange={() => onSelect(opt.letter)}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-xs font-medium ${
                            isSelected
                              ? 'bg-coral-100 text-coral-700 dark:bg-coral-900/50 dark:text-coral-300'
                              : 'bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400'
                          }`}
                          aria-hidden="true"
                        >
                          {opt.letter}
                        </span>
                        <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-200">
                          {opt.text}
                        </span>
                        {isSelected && (
                          <CheckCircle
                            className="h-4 w-4 flex-shrink-0 text-coral-500"
                            aria-hidden="true"
                          />
                        )}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </fieldset>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <Button onClick={onNext} disabled={!selectedAnswer}>
                {step === total ? 'See My Results' : 'Next →'}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function LeadCapture({
  stage,
  firstName,
  email,
  status,
  errorMessage,
  onFirstNameChange,
  onEmailChange,
  onSubmit,
  transition,
}: {
  stage: string
  firstName: string
  email: string
  status: 'idle' | 'loading' | 'success' | 'error'
  errorMessage: string
  onFirstNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  transition: string
}) {
  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-coral-50 p-8 dark:border-teal-800 dark:from-teal-900/20 dark:to-coral-900/20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500">
            <CheckCircle className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-white">
            Welcome to the pero community.
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            As pero grows, we&apos;ll share resources and updates matched to your caregiving stage.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/30 bg-white/20 p-8 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-white/10">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
            <Mail className="h-6 w-6 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-white">
            Stay connected to your caregiving journey.
          </h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Join pero&apos;s early community. As pero grows, we&apos;ll send you resources, tools, and
            updates matched to your{' '}
            <strong className="text-neutral-700 dark:text-neutral-100">{stage}</strong> stage.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <Input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              disabled={status === 'loading'}
              className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
              aria-label="First name (optional)"
              autoComplete="given-name"
            />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              disabled={status === 'loading'}
              className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
              aria-label="Email address"
              autoComplete="email"
            />
            <Button
              type="submit"
              disabled={status === 'loading' || !email}
              className={`w-full ${transition}`}
            >
              {status === 'loading' ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Joining...
                </>
              ) : (
                'Join pero →'
              )}
            </Button>
          </form>

          {status === 'error' && (
            <div aria-live="assertive" className="mt-3">
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            </div>
          )}

          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
