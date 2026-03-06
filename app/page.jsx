'use client'

import { useState, useMemo } from 'react'
import { getAllCases } from '../lib/cases'
import Sidebar from './components/Sidebar'
import CaseGrid from './components/CaseGrid'

const casesData = getAllCases()

// ── Pre-compute all unique filter options ──────────────────────────────────────
const ALL_COMPANIES   = [...new Set(casesData.map((c) => c.company))].sort()
const ALL_INDUSTRIES  = [...new Set(casesData.map((c) => c.industry))].sort()
const ALL_CATEGORIES  = [...new Set(casesData.map((c) => c.category))].sort()
const ALL_DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function computeCounts(data) {
  const company    = {}
  const industry   = {}
  const category   = {}
  const difficulty = {}
  for (const c of data) {
    company[c.company]       = (company[c.company]       ?? 0) + 1
    industry[c.industry]     = (industry[c.industry]     ?? 0) + 1
    category[c.category]     = (category[c.category]     ?? 0) + 1
    difficulty[c.difficulty] = (difficulty[c.difficulty] ?? 0) + 1
  }
  return { company, industry, category, difficulty }
}

const ALL_COUNTS = computeCounts(casesData)

// ── Hero stats ─────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Cases',    value: casesData.length },
  { label: 'Companies',      value: ALL_COMPANIES.length },
  { label: 'Case Types',     value: ALL_CATEGORIES.length },
  { label: 'Industries',     value: ALL_INDUSTRIES.length },
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
  })

  // Apply filters
  const filteredCases = useMemo(() => {
    return casesData.filter((c) => {
      if (filters.companies.length   && !filters.companies.includes(c.company))     return false
      if (filters.industries.length  && !filters.industries.includes(c.industry))   return false
      if (filters.categories.length  && !filters.categories.includes(c.category))   return false
      if (filters.difficulties.length && !filters.difficulties.includes(c.difficulty)) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const haystack = `${c.title} ${c.company} ${c.industry} ${c.category} ${c.prompt}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [filters])

  return (
    <div className="relative">
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute -top-24 -left-10 w-72 h-72 rounded-full bg-brand-200/40 blur-3xl animate-float-slow" />
        <div className="absolute -top-32 right-0 w-[22rem] h-[22rem] rounded-full bg-orange-200/45 blur-3xl animate-float-slow [animation-delay:1.2s]" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-12 lg:py-16 relative">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            <div className="max-w-3xl animate-rise">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 bg-white/90 border border-brand-200 rounded-full px-3 py-1 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                IFSA SSC Casebook 2025
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.05] mb-5">
                Practice Like a
                <span className="text-brand-700"> Top-Tier Consultant</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Browse {casesData.length} real interview transcripts from McKinsey, BCG, Bain and more.
                Filter by case type, company, and difficulty, then self-grade with structured reveal mode.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#case-library" className="btn-primary">
                  Explore Cases
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  How It Works
                </a>
              </div>
            </div>

            <div className="card p-5 sm:p-6 animate-rise [animation-delay:120ms]">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500 font-semibold mb-3">
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
                        <p className="font-semibold text-slate-800">{d}</p>
                        <p className="text-slate-500">{count} cases</p>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden ring-1 ring-slate-200">
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
                  <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <p className="text-xl font-bold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl animate-rise [animation-delay:220ms]">
            {STATS.map((s) => (
              <div key={s.label} className="card px-4 py-4">
                <p className="text-2xl font-bold text-brand-700">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content: Sidebar + Grid ──────────────────────────────────── */}
      <section id="case-library" className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-5">
        <div className="rounded-[1.6rem] border border-slate-200/90 bg-white/70 backdrop-blur-sm overflow-hidden shadow-[0_20px_60px_rgba(10,30,90,0.08)]">
          <div className="max-w-screen-2xl mx-auto flex min-h-[calc(100vh-14rem)]">
            <Sidebar
              options={{
                companies:    ALL_COMPANIES,
                industries:   ALL_INDUSTRIES,
                categories:   ALL_CATEGORIES,
                difficulties: ALL_DIFFICULTIES,
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
      <section id="about" className="border-t border-slate-200/80 bg-white/55">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-14">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-700 font-semibold mb-3">Workflow</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-7">
              Designed for deliberate case practice
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Pick a case', desc: 'Use filters to target the company, sector, and problem type you want to train.' },
                { step: '02', title: 'Structure your thinking', desc: 'Read the interviewer prompt and build your own approach before revealing anything.' },
                { step: '03', title: 'Benchmark & improve', desc: 'Compare with the candidate answer and score your own structure and clarity.' },
              ].map((item) => (
                <div key={item.step} className="card p-5 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm font-black flex items-center justify-center">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">{item.title}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-6 px-4 sm:px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2025 IFSA SSC — Case Interview Prep Platform</p>
          <p>Built with Next.js · Data from IFSA SSC Casebook 2025</p>
        </div>
      </footer>
    </div>
  )
}
