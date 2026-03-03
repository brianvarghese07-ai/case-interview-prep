'use client'

import { useState, useMemo } from 'react'
import casesData from '../public/data/cases.json'
import Sidebar from './components/Sidebar'
import CaseGrid from './components/CaseGrid'

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
    <div>
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              IFSA SSC Casebook 2025
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
              Case Interview
              <span className="text-brand-600"> Prep Library</span>
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Browse {casesData.length} real interview transcripts from McKinsey, BCG, Bain and more.
              Filter by case type, company, and difficulty — then self-grade with the reveal solution feature.
            </p>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {STATS.map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                <p className="text-2xl font-bold text-brand-700">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content: Sidebar + Grid ──────────────────────────────────── */}
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

      {/* ── About Section ─────────────────────────────────────────────────── */}
      <section id="about" className="border-t border-slate-200 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">How to use this platform</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Pick a case', desc: 'Use the filters to find a case matching your target company, industry, or difficulty level.' },
                { step: '02', title: 'Read the prompt', desc: "The interviewer's question is shown immediately. Take 2–3 minutes to structure your thinking." },
                { step: '03', title: 'Reveal & grade', desc: "Click 'Reveal Solution' to compare your approach with the successful candidate's response." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="text-2xl font-black text-brand-200 flex-shrink-0">{item.step}</div>
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
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 px-4 sm:px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2025 IFSA SSC — Case Interview Prep Platform</p>
          <p>Built with Next.js · Data from IFSA SSC Casebook 2025</p>
        </div>
      </footer>
    </div>
  )
}
