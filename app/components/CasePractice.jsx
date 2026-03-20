'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  Eye, EyeOff, Building2, Tag, Layers, BarChart2,
  BookOpen, CheckCircle2, Clock,
} from 'lucide-react'

const DIFFICULTY_STYLES = {
  Easy:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50  text-amber-700  border-amber-200',
  Hard:   'bg-red-50    text-red-700    border-red-200',
}

const CATEGORY_ICONS = {
  Guesstimate:              '🔢',
  Profitability:            '📉',
  'Market Entry':           '🚀',
  'Market Growth & Sizing': '📈',
  'Pricing Strategy':       '💰',
  Unconventional:           '🎯',
}

/** Renders long-form text with paragraph breaks */
function TextBlock({ text, className = '' }) {
  if (!text) return <p className="text-slate-400 italic">Not available.</p>
  return (
    <div className={`space-y-3 ${className}`}>
      {text.split('\n\n').map((para, i) => (
        <p key={i} className="text-slate-700 leading-relaxed text-sm sm:text-[0.95rem] whitespace-pre-wrap">
          {para}
        </p>
      ))}
    </div>
  )
}

function parseExplicitSpeaker(line) {
  const trimmed = line.trim()
  if (!trimmed) return { speaker: 'none', text: '', explicit: false }

  // Explicit labels from source transcripts.
  const interviewerMatch = trimmed.match(/^(?:I|Interviewer)\s*[:\-]\s*(.+)$/i)
  if (interviewerMatch) return { speaker: 'interviewer', text: interviewerMatch[1].trim(), explicit: true }

  const candidateMatch = trimmed.match(/^(?:C|Candidate)\s*[:\-]\s*(.+)$/i)
  if (candidateMatch) return { speaker: 'candidate', text: candidateMatch[1].trim(), explicit: true }

  return { speaker: null, text: trimmed, explicit: false }
}

function looksLikeInterviewerReply(text) {
  return /^(?:yes|no|both\.?$|all\.?$|sure|right|okay|ok|great|fair|understood|please|go ahead|you may|sounds good|that(?:'s| is) (?:fine|right|reasonable)|consider|just|only|include|correct|exactly|good|proceed|try|fair assumption|interesting|alright|all right)/i.test(text.trim())
}

function splitMixedTurn(text) {
  const firstQuestionMark = text.indexOf('?')
  const firstPeriod = text.indexOf('.')

  if (firstQuestionMark === -1 || firstPeriod === -1 || firstPeriod > firstQuestionMark) {
    return null
  }

  const interviewerText = text.slice(0, firstPeriod + 1).trim()
  const candidateText = text.slice(firstPeriod + 1).trim()

  if (!interviewerText || !candidateText || !looksLikeInterviewerReply(interviewerText)) {
    return null
  }

  return {
    interviewerText,
    candidateText,
  }
}

function SolutionDialogue({ text }) {
  if (!text) return <p className="text-slate-400 italic">Not available.</p>

  const rawLines = text.split('\n')
  const lines = []
  let lastSpeaker = null
  let lastText = ''

  for (let i = 0; i < rawLines.length; i += 1) {
    const classified = parseExplicitSpeaker(rawLines[i])

    if (classified.speaker === 'none') {
      lines.push(classified)
      continue
    }

    if (classified.explicit) {
      lines.push(classified)
      lastSpeaker = classified.speaker
      lastText = classified.text
      continue
    }

    const current = classified.text
    const wordCount = current.split(/\s+/).filter(Boolean).length
    const prevWasQuestion = lastText.endsWith('?')
    const shortReply = wordCount > 0 && wordCount <= 10
    const interviewerCue = looksLikeInterviewerReply(current)
    const mixedTurn = prevWasQuestion ? splitMixedTurn(current) : null

    if (mixedTurn) {
      lines.push({ speaker: 'interviewer', text: mixedTurn.interviewerText })
      lines.push({ speaker: 'candidate', text: mixedTurn.candidateText })
      lastSpeaker = 'candidate'
      lastText = mixedTurn.candidateText
    } else if (prevWasQuestion) {
      lines.push({ speaker: 'interviewer', text: current })
      lastSpeaker = 'interviewer'
      lastText = current
    } else if (lastSpeaker === 'interviewer') {
      lines.push({ speaker: 'candidate', text: current })
      lastSpeaker = 'candidate'
      lastText = current
    } else if (lastSpeaker === 'candidate' && shortReply && interviewerCue) {
      lines.push({ speaker: 'interviewer', text: current })
      lastSpeaker = 'interviewer'
      lastText = current
    } else {
      lines.push({ speaker: 'candidate', text: current })
      lastSpeaker = 'candidate'
      lastText = current
    }
  }

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        if (line.speaker === 'none') {
          return <div key={idx} className="h-2" />
        }

        return (
          <p
            key={idx}
            className={`leading-relaxed text-sm sm:text-[0.95rem] whitespace-pre-wrap ${
              line.speaker === 'candidate'
                ? 'font-semibold text-slate-900'
                : 'font-normal text-slate-700'
            }`}
          >
            {line.text}
          </p>
        )
      })}
    </div>
  )
}

export default function CasePractice({ c, prev, next, total }) {
  const [revealed, setRevealed] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [intervalId, setIntervalId] = useState(null)

  const startTimer = () => {
    if (timerStarted) return
    setTimerStarted(true)
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    setIntervalId(id)
  }

  const stopTimer = () => {
    if (intervalId) clearInterval(intervalId)
  }

  const handleReveal = () => {
    if (!revealed) stopTimer()
    setRevealed(!revealed)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    return `${m}:${String(s % 60).padStart(2, '0')}`
  }

  const diffStyle = DIFFICULTY_STYLES[c.difficulty] ?? DIFFICULTY_STYLES.Medium

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 relative">
      <div className="absolute -top-20 left-8 w-52 h-52 rounded-full bg-brand-200/40 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute -top-8 right-8 w-60 h-60 rounded-full bg-orange-200/40 blur-3xl pointer-events-none animate-float-slow [animation-delay:1s]" />

      {/* ── Breadcrumb nav ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center gap-2 py-4 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-brand-700 transition-colors rounded-lg px-2.5 py-1.5 hover:bg-white/80"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Case Library
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium truncate">{c.title}</span>
      </div>

      <div className="relative z-10 pb-16 grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ── Main Panel ─────────────────────────────────────────────────── */}
        <div className="space-y-6 animate-rise">

          {/* Case header */}
          <div className="card p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.14em] mb-2">
                  {CATEGORY_ICONS[c.category]} {c.category}
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {c.title}
                </h1>
              </div>
              <span className={`badge border text-sm px-3 py-1 shadow-sm ${diffStyle}`}>
                {c.difficulty}
              </span>
            </div>

            {/* Metadata pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-brand-500" />
                <span className="font-medium text-slate-700">{c.company}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                <Tag className="w-3.5 h-3.5 text-brand-500" />
                {c.industry}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                <Layers className="w-3.5 h-3.5 text-brand-500" />
                {c.category}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                <BarChart2 className="w-3.5 h-3.5 text-brand-500" />
                {c.year}
              </div>
            </div>
          </div>

          {/* ── INTERVIEWER PROMPT ─────────────────────────────────────── */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100/90 flex items-center justify-between bg-white/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-xs font-bold">I</span>
                </div>
                <h2 className="font-semibold text-slate-800">Interviewer Prompt</h2>
              </div>
              {/* Prep timer */}
              <div className="flex items-center gap-2">
                {timerStarted && (
                  <span className="text-xs font-mono font-semibold text-brand-600 bg-brand-50 border border-brand-200 rounded-md px-2 py-0.5">
                    ⏱ {formatTime(seconds)}
                  </span>
                )}
                {!timerStarted && (
                  <button
                    onClick={startTimer}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 border border-slate-200 hover:border-brand-300 rounded-xl px-2.5 py-1.5 bg-white transition-all"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Start Timer
                  </button>
                )}
              </div>
            </div>
            <div className="px-5 py-5 bg-gradient-to-b from-brand-50/50 to-white">
              <TextBlock text={c.prompt} />
            </div>
          </div>

          {/* ── FRAMEWORK / SOLUTION REVEAL ───────────────────────────── */}
          <div className="card overflow-hidden">
            {/* Reveal toggle button */}
            <button
              onClick={handleReveal}
              className={`w-full px-5 py-4 flex items-center justify-between gap-3 border-b transition-colors ${
                revealed
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* C badge */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  revealed ? 'bg-emerald-600' : 'bg-slate-700'
                }`}>
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div className="text-left">
                  <p className={`font-semibold text-sm ${revealed ? 'text-emerald-800' : 'text-white'}`}>
                    {revealed ? 'Solution Revealed' : 'Reveal Solution'}
                  </p>
                  <p className={`text-xs ${revealed ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {revealed
                      ? 'Compare your approach with the candidate\'s answer'
                      : 'Attempt the case first, then click to reveal'}
                  </p>
                </div>
              </div>
              {revealed ? (
                <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <Eye className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
            </button>

            {/* Solution content */}
            {revealed && (
              <div className="px-5 py-5 bg-gradient-to-b from-emerald-50/50 to-white border-l-4 border-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Candidate's Framework & Answer
                  </p>
                </div>
                <SolutionDialogue text={c.solution} />
              </div>
            )}

            {/* Hide button when revealed */}
            {revealed && (
              <button
                onClick={handleReveal}
                className="w-full px-5 py-3 flex items-center justify-center gap-2 border-t border-slate-100 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5" />
                Hide Solution
              </button>
            )}
          </div>

          {/* ── Navigation arrows ─────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 pt-2">
            {prev ? (
              <Link
                href={`/cases/${prev.id}`}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 card px-4 py-2.5 hover:shadow-md transition-all group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <div className="text-left">
                  <p className="text-xs text-slate-400">Previous</p>
                  <p className="truncate max-w-[160px] group-hover:text-brand-600">{prev.title}</p>
                </div>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/cases/${next.id}`}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 card px-4 py-2.5 hover:shadow-md transition-all group ml-auto"
              >
                <div className="text-right">
                  <p className="text-xs text-slate-400">Next</p>
                  <p className="truncate max-w-[160px] group-hover:text-brand-600">{next.title}</p>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* ── Right Side Panel ──────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-24 animate-rise [animation-delay:120ms]">
          {/* Case info card */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <h3 className="font-semibold text-sm text-slate-800">Case Details</h3>
            </div>
            <dl className="space-y-3">
              {[
                { label: 'Company',    value: c.company },
                { label: 'Industry',   value: c.industry },
                { label: 'Type',       value: c.category },
                { label: 'Year',       value: c.year },
                { label: 'Difficulty', value: c.difficulty },
                { label: 'Source Book', value: c.sourceBook },
                { label: 'Section',    value: c.sourceSection },
                { label: 'Case No.',   value: `${c.id} / ${total}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <dt className="text-xs text-slate-400 flex-shrink-0">{label}</dt>
                  <dd className="text-xs font-medium text-slate-700 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Self-assessment guide */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-slate-800 mb-3">Self-Grading Checklist</h3>
            <ul className="space-y-2.5">
              {[
                'Did you clarify the problem scope?',
                'Did you lay out a structured framework?',
                'Were your assumptions explicit & reasonable?',
                'Did you quantify where possible?',
                'Did you state a clear recommendation?',
              ].map((q) => (
                <li key={q} className="flex items-start gap-2">
                  <CheckboxItem label={q} />
                </li>
              ))}
            </ul>
          </div>

          {/* Back to library */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 card p-3 hover:shadow-md hover:text-brand-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Library
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Interactive checkbox for the self-grading checklist */
function CheckboxItem({ label }) {
  const [checked, setChecked] = useState(false)
  return (
    <label className="flex items-start gap-2 cursor-pointer group" onClick={() => setChecked(!checked)}>
      <div className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
        checked ? 'bg-brand-600 border-brand-600' : 'border-slate-300 group-hover:border-brand-400'
      }`}>
        {checked && (
          <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-xs leading-relaxed transition-colors ${checked ? 'line-through text-slate-400' : 'text-slate-600 group-hover:text-slate-800'}`}>
        {label}
      </span>
    </label>
  )
}
