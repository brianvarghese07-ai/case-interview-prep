'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  CircleDot,
  Mic,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

function ScoreBar({ label, weight, focus }) {
  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="font-semibold text-[color:var(--ink)]">{label}</p>
        <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
          {weight}%
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">{focus}</p>
    </div>
  )
}

export default function MockInterviewStudio({ c, blueprint }) {
  const [sessionState, setSessionState] = useState({
    status: 'idle',
    error: '',
    payload: null,
  })

  async function handleCreateSession() {
    setSessionState({ status: 'loading', error: '', payload: null })

    try {
      const response = await fetch('/api/mock-interview/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: c.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize mock interview session.')
      }

      setSessionState({ status: 'ready', error: '', payload: data })
    } catch (error) {
      setSessionState({
        status: 'error',
        error: error.message || 'Something went wrong while creating the session.',
        payload: null,
      })
    }
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-2 text-sm mb-5">
        <Link
          href={`/cases/${c.id}`}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[color:var(--ink-soft)] transition-colors hover:bg-[color:var(--surface)] hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to case
        </Link>
      </div>

      <section className="card p-6 sm:p-8">
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="practice-hero-badge mb-4">
              <Radio className="h-3.5 w-3.5" />
              Mock interview
            </div>
            <h1 className="font-display text-3xl font-bold text-[color:var(--ink)] sm:text-5xl">
              {c.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--ink-soft)] sm:text-base">
              Turn this case into a live mock interview with controlled fact reveals, structured pacing, and a clear evaluation rubric.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[c.company, c.industry, c.category, c.difficulty].map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-soft)]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={handleCreateSession} className="btn-primary justify-center">
                <Play className="h-4 w-4" />
                Create Mock Session
              </button>
              <a
                href="#scorecard"
                className="btn-secondary justify-center"
              >
                View Scorecard
              </a>
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Mic className="h-4 w-4 text-[color:var(--brand)]" />
              <h2 className="text-sm font-semibold text-[color:var(--ink)]">Your session</h2>
            </div>
            <div className="space-y-3 text-sm text-[color:var(--ink-soft)]">
              <p>
                Each session is tailored to this case: the interviewer opens with the prompt, reveals facts as you
                ask for them, and keeps the conversation on interview pacing.
              </p>
              <p>
                When you finish, your performance can be scored against a structured rubric.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
              {sessionState.status === 'idle' && (
                <p className="text-sm text-[color:var(--ink-soft)]">
                  No session started yet. Click Create Mock Session to begin.
                </p>
              )}
              {sessionState.status === 'loading' && (
                <p className="text-sm font-medium text-[color:var(--brand)]">Setting up your interview session...</p>
              )}
              {sessionState.status === 'error' && (
                <p className="text-sm font-medium text-red-600">{sessionState.error}</p>
              )}
              {sessionState.status === 'ready' && (
                <div className="space-y-2 text-sm text-[color:var(--ink-soft)]">
                  <p className="font-semibold text-emerald-700">
                    {sessionState.payload.realtime?.enabled
                      ? 'Live session ready.'
                      : 'Session ready.'}
                  </p>
                  <p>Duration target: {sessionState.payload.blueprint.format.durationMinutes} minutes</p>
                  <p>Interviewer style: {sessionState.payload.blueprint.format.interviewerStyle}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-brand-600" />
              <h2 className="text-sm font-semibold text-[color:var(--ink)]">Live call flow</h2>
            </div>
            <div className="space-y-4">
              {blueprint.callStages.map((stage, index) => (
                <div key={stage.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-sm font-bold text-brand-700">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-[color:var(--ink)]">{stage.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-soft)]">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <h2 className="text-sm font-semibold text-[color:var(--ink)]">Likely student clarifiers</h2>
            </div>
            <ul className="space-y-2">
              {blueprint.likelyClarifyingQuestions.map((question) => (
                <li key={question} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand-600" />
              <h2 className="text-sm font-semibold text-[color:var(--ink)]">Interviewer operating rules</h2>
            </div>
            <ul className="space-y-3">
              {blueprint.interviewerObjectives.map((rule) => (
                <li key={rule} className="flex items-start gap-2 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              <h2 className="text-sm font-semibold text-[color:var(--ink)]">Facts to reveal gradually</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {blueprint.revealFacts.map((fact) => (
                <div key={fact} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="scorecard" className="mt-6 card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand-600" />
          <h2 className="text-sm font-semibold text-[color:var(--ink)]">Evaluation scorecard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blueprint.scoringRubric.map((item) => (
            <ScoreBar key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}
