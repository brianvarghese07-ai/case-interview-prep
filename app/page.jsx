'use client'

import { useState, useMemo } from 'react'
import { Headphones, LibraryBig } from 'lucide-react'
import { getAllCases } from '../lib/cases'
import Sidebar from './components/Sidebar'
import CaseGrid from './components/CaseGrid'

const casesData = getAllCases()

// ── Pre-compute all unique filter options ──────────────────────────────────────
const ALL_COMPANIES   = [...new Set(casesData.map((c) => c.company))].sort()
const ALL_INDUSTRIES  = [...new Set(casesData.map((c) => c.industry))].sort()
const ALL_CATEGORIES  = [...new Set(casesData.map((c) => c.category))].sort()
const ALL_YEARS = [...new Set(casesData.map((c) => String(c.year)).filter(Boolean))]
  .sort((a, b) => Number(b) - Number(a))
const ALL_DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function computeCounts(data) {
  const company    = {}
  const industry   = {}
  const category   = {}
  const difficulty = {}
  const year       = {}
  for (const c of data) {
    company[c.company]       = (company[c.company]       ?? 0) + 1
    industry[c.industry]     = (industry[c.industry]     ?? 0) + 1
    category[c.category]     = (category[c.category]     ?? 0) + 1
    difficulty[c.difficulty] = (difficulty[c.difficulty] ?? 0) + 1
    year[String(c.year)]     = (year[String(c.year)]     ?? 0) + 1
  }
  return { company, industry, category, difficulty, year }
}

const ALL_COUNTS = computeCounts(casesData)

// ── Hero stats ─────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Cases',    value: casesData.length },
  { label: 'Casebooks',      value: ALL_YEARS.length },
  { label: 'Companies',      value: ALL_COMPANIES.length },
  { label: 'Industries',     value: ALL_INDUSTRIES.length },
]

const FEATURED_TRACKS = [
  {
    icon: LibraryBig,
    label: 'Study Track',
    title: 'Build pattern recognition fast',
    body: 'Scan case prompts, compare candidate approaches, and notice how great answers frame, branch, and synthesize.',
  },
  {
    icon: Headphones,
    label: 'Practice Chat Track',
    title: 'Practice under real conversational pressure',
    body: 'Switch from reading to dialogue. Gemini stays in interviewer mode, adapts to your questions, and keeps the case moving naturally.',
  },
]

const DIFFICULTY_META = {
  Easy: { color: 'bg-emerald-500', ring: 'ring-emerald-200' },
  Medium: { color: 'bg-amber-500', ring: 'ring-amber-200' },
  Hard: { color: 'bg-rose-500', ring: 'ring-rose-200' },
}

export default function HomePage() {
  const [filters, setFilters] = useState({
    search:       '',
    companies:    [],
    industries:   [],
    categories:   [],
    difficulties: [],
    years:        [],
  })

  // Apply filters
  const filteredCases = useMemo(() => {
    return casesData.filter((c) => {
      if (filters.companies.length   && !filters.companies.includes(c.company))     return false
      if (filters.industries.length  && !filters.industries.includes(c.industry))   return false
      if (filters.categories.length  && !filters.categories.includes(c.category))   return false
      if (filters.difficulties.length && !filters.difficulties.includes(c.difficulty)) return false
      if (filters.years.length && !filters.years.includes(String(c.year))) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const haystack = `${c.title} ${c.company} ${c.industry} ${c.category} ${c.prompt} ${c.sourceBook ?? ''} ${c.year ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [filters])

  return (
    <div className="relative">
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[color:var(--border)]">
        <div className="absolute -top-24 -left-10 w-72 h-72 rounded-full bg-brand-200/40 blur-3xl animate-float-slow" />
        <div className="absolute -top-32 right-0 w-[22rem] h-[22rem] rounded-full bg-orange-200/45 blur-3xl animate-float-slow [animation-delay:1.2s]" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 sm:gap-8 items-start">
            <div className="max-w-3xl animate-rise">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 bg-[color:var(--surface)]/90 border border-brand-200 rounded-full px-3 py-1 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                IFSA Casebooks 2023-2025
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[color:var(--ink)] tracking-tight leading-[1.02] mb-4 sm:mb-5 max-w-[14ch] sm:max-w-none">
                Train the
                <span className="text-brand-700"> consulting conversation</span>
              </h1>
              <p className="text-[color:var(--ink-soft)] text-sm sm:text-lg leading-relaxed max-w-2xl">
                Browse {casesData.length} real interview cases from the IFSA 2023, 2024, and 2025 casebooks.
                Study them in a clean library, then switch into an interactive practice chat where the interviewer reveals facts as the discussion earns them.
              </p>
              <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a href="#case-library" className="btn-primary justify-center">
                  Explore Cases
                </a>
                <a
                  href="/practice"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                >
                  Try Practice Chat
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--ink-soft)] hover:bg-slate-50 transition-colors"
                >
                  How It Works
                </a>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3 max-w-3xl">
                {[
                  'Learn the best candidate patterns',
                  'Switch instantly into practice chat',
                  'Review structure, math, and synthesis',
                ].map((point) => (
                  <div key={point} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/78 px-4 py-3 text-sm font-medium text-[color:var(--ink-soft)] shadow-sm backdrop-blur-sm">
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4 sm:p-6 animate-rise [animation-delay:120ms] order-last lg:order-none">
              <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--muted)] font-semibold mb-2">
                      Training Snapshot
                    </p>
                    <h3 className="font-display text-2xl font-bold text-[color:var(--ink)]">From library to live interviewer</h3>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white shadow-lg">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">Best for</p>
                    <p className="text-sm font-semibold">Interactive drills</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {FEATURED_TRACKS.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/90 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{item.label}</p>
                            <p className="mt-1 font-semibold text-[color:var(--ink)]">{item.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-soft)]">{item.body}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--muted)] font-semibold mb-3">
                Difficulty Distribution
              </p>
              <div className="space-y-3 mb-5">
                {ALL_DIFFICULTIES.map((d) => {
                  const count = ALL_COUNTS.difficulty?.[d] ?? 0
                  const pct = Math.round((count / casesData.length) * 100)
                  const meta = DIFFICULTY_META[d]
                  return (
                    <div key={d}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <p className="font-semibold text-[color:var(--ink)]">{d}</p>
                        <p className="text-[color:var(--muted)]">{count} cases</p>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden ring-1 ring-[color:var(--border)]">
                        <div
                          className={`h-full rounded-full ${meta.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STATS.slice(0, 2).map((s) => (
                  <div key={s.label} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
                    <p className="text-xl font-bold text-[color:var(--ink)]">{s.value}</p>
                    <p className="text-xs text-[color:var(--muted)]">{s.label}</p>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2 animate-rise [animation-delay:180ms]">
            <div className="mode-card">
              <div className="mode-label">
                Study Mode
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-[color:var(--ink)]">Learn the case before you perform it</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                Read prompts, compare candidate solutions, and build your instincts across sectors, companies, and case types.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                <span className="soft-chip">Searchable case library</span>
                <span className="soft-chip">Reveal-mode practice</span>
                <span className="soft-chip">Self-grading checklist</span>
              </div>
            </div>

            <div className="mode-card-accent">
              <div className="mode-label-brand">
                Practice Chat Mode
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-[color:var(--ink)]">Practice the real conversation</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                Start with a category like profitability, market entry, or guesstimate and work through the case in an interviewer-style Gemini chat.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-brand-800/80">
                <span className="brand-chip">Interviewer-style chat</span>
                <span className="brand-chip">Controlled fact reveals</span>
                <span className="brand-chip">Gemini grounded mode</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 sm:mt-9 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl animate-rise [animation-delay:220ms]">
            {STATS.map((s, idx) => (
              <div key={s.label} className={`card px-4 py-4 ${idx > 1 ? 'hidden sm:block' : ''}`}>
                <p className="text-2xl font-bold text-brand-700">{s.value}</p>
                <p className="text-xs text-[color:var(--muted)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content: Sidebar + Grid ──────────────────────────────────── */}
      <section id="case-library" className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-5">
        <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-3)] backdrop-blur-sm overflow-visible lg:overflow-hidden shadow-[0_20px_60px_rgba(10,30,90,0.08)]">
          <div className="border-b border-[color:var(--border)] bg-[linear-gradient(90deg,var(--surface),var(--surface-2))] px-4 sm:px-6 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Two ways to train</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[color:var(--ink)]">Study the case or launch the practice chat</h2>
                <p className="mt-1 text-sm text-[color:var(--ink-soft)]">
                  Every case page now supports both self-study and an interviewer-style Gemini practice chat.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-soft)]">Mode 1: Study</span>
                <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">Mode 2: Practice chat</span>
              </div>
            </div>
          </div>
          <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-14rem)]">
            <Sidebar
              options={{
                companies:    ALL_COMPANIES,
                industries:   ALL_INDUSTRIES,
                categories:   ALL_CATEGORIES,
                difficulties: ALL_DIFFICULTIES,
                years:        ALL_YEARS,
              }}
              counts={ALL_COUNTS}
              filters={filters}
              setFilters={setFilters}
              totalVisible={filteredCases.length}
              totalAll={casesData.length}
            />
            <CaseGrid
              cases={filteredCases}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      </section>

      {/* ── About Section ─────────────────────────────────────────────────── */}
      <section id="about" className="border-t border-[color:var(--border)] bg-[color:var(--surface)]/35">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-14">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-700 font-semibold mb-3">Workflow</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[color:var(--ink)] mb-7">
              Designed for deliberate case practice
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Study the pattern', desc: 'Use the library to absorb how strong candidates clarify scope, structure their thinking, and drive the case.' },
                { step: '02', title: 'Switch into dialogue mode', desc: 'Launch practice chat when you want a more interactive interviewer-style back-and-forth instead of static reading.' },
                { step: '03', title: 'Push your thinking live', desc: 'Use category-based drills to practice clarifying questions, structure, assumptions, and recommendations in real time.' },
              ].map((item) => (
                <div key={item.step} className="card p-5 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm font-black flex items-center justify-center">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-[color:var(--ink)] mb-1">{item.title}</p>
                    <p className="text-sm text-[color:var(--muted)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-[color:var(--muted)] leading-relaxed max-w-3xl">
              We would like to thank all the IFSA chapters we partnered with from the DU circuit in the making of our casebooks.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-6 px-4 sm:px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2025 IFSA SSC — Case Interview Prep Platform</p>
          <p>Built with Next.js · Data from IFSA casebooks 2023-2025</p>
        </div>
      </footer>
    </div>
  )
}
