'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, BarChart3, BookOpenText, MessageSquareText } from 'lucide-react'
import { getAllCases } from '../lib/cases'
import Sidebar from './components/Sidebar'
import CaseGrid from './components/CaseGrid'
import FloatingLines from './components/FloatingLines'

const casesData = getAllCases()

const ALL_COMPANIES = [...new Set(casesData.map((c) => c.company))].sort()
const ALL_INDUSTRIES = [...new Set(casesData.map((c) => c.industry))].sort()
const ALL_CATEGORIES = [...new Set(casesData.map((c) => c.category))].sort()
const ALL_YEARS = [...new Set(casesData.map((c) => String(c.year)).filter(Boolean))]
  .sort((a, b) => Number(b) - Number(a))
const ALL_DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function computeCounts(data) {
  const company = {}
  const industry = {}
  const category = {}
  const difficulty = {}
  const year = {}

  for (const c of data) {
    company[c.company] = (company[c.company] ?? 0) + 1
    industry[c.industry] = (industry[c.industry] ?? 0) + 1
    category[c.category] = (category[c.category] ?? 0) + 1
    difficulty[c.difficulty] = (difficulty[c.difficulty] ?? 0) + 1
    year[String(c.year)] = (year[String(c.year)] ?? 0) + 1
  }

  return { company, industry, category, difficulty, year }
}

const ALL_COUNTS = computeCounts(casesData)

const STATS = [
  { label: 'Cases', value: casesData.length },
  { label: 'Casebooks', value: ALL_YEARS.length },
  { label: 'Companies', value: ALL_COMPANIES.length },
  { label: 'Industries', value: ALL_INDUSTRIES.length },
]

const WORKFLOW = [
  {
    icon: BookOpenText,
    title: 'Study',
    body: 'Read the prompt, inspect the case facts, and compare your structure against the solution.',
  },
  {
    icon: MessageSquareText,
    title: 'Practice',
    body: 'Start a guided interview when you want pressure, pacing, and follow-up questions.',
  },
  {
    icon: BarChart3,
    title: 'Review',
    body: 'Use filters to find similar cases and build pattern recognition across sectors and case types.',
  },
]

export default function HomePage() {
  const [filters, setFilters] = useState({
    search: '',
    companies: [],
    industries: [],
    categories: [],
    difficulties: [],
    years: [],
  })

  const filteredCases = useMemo(() => {
    return casesData.filter((c) => {
      if (filters.companies.length && !filters.companies.includes(c.company)) return false
      if (filters.industries.length && !filters.industries.includes(c.industry)) return false
      if (filters.categories.length && !filters.categories.includes(c.category)) return false
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
    <div>
      <section className="bg-[color:var(--bg)]">
        <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:py-8">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[#191a23] px-6 py-10 sm:px-10 lg:py-14">
            <div className="absolute inset-0" aria-hidden="true">
              <FloatingLines
                linesGradient={['#16255c', '#2b4acb', '#7ea2f0']}
                enabledWaves={['top', 'middle', 'bottom']}
                lineCount={[4, 5, 7]}
                lineDistance={[9, 7, 5]}
                animationSpeed={0.5}
                interactive={true}
                bendRadius={5.0}
                bendStrength={-0.5}
                parallax={true}
                parallaxStrength={0.15}
              />
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#191a23] via-[#191a23]/45 to-transparent"
              aria-hidden="true"
            />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center">
              <div className="max-w-4xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#a3bcf5]">IFSA Casebooks 2023–2025</p>
                <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
                  A focused case library for consulting interview practice
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                  Search real casebook prompts, filter by company and case type, then start a guided interview when you want a live practice rhythm.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#case-library"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#191a23] transition-transform hover:-translate-y-0.5 justify-center"
                  >
                    Browse cases
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/practice"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60 justify-center"
                  >
                    Start practice
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-5 backdrop-blur-sm"
                  >
                    <p className="text-3xl font-bold tracking-tight text-white">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-white/60">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-3">
            {WORKFLOW.map((item, index) => {
              const Icon = item.icon
              const isDark = index === 2
              return (
                <div
                  key={item.title}
                  className={`card p-6 ${
                    isDark
                      ? 'bg-[#191a23] dark-card'
                      : index === 1
                        ? 'bg-[color:var(--brand-soft)]'
                        : 'bg-[color:var(--surface-2)]'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isDark ? 'text-white' : 'text-[color:var(--brand)]'}`} />
                  <h2 className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-[color:var(--ink)]'}`}>
                    {item.title}
                  </h2>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-[color:var(--muted)]'}`}>
                    {item.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="case-library" className="mx-auto max-w-screen-2xl px-3 py-5 sm:px-6">
        <div className="app-shell">
          <div className="app-shell-header">
            <div>
              <p className="section-kicker">Case Library</p>
              <h2 className="mt-1 text-xl font-semibold text-[color:var(--ink)]">Find the right case to work on</h2>
            </div>
            <div className="hidden items-center gap-2 text-sm text-[color:var(--muted)] sm:flex">
              <span className="font-semibold text-[color:var(--ink)]">{filteredCases.length}</span>
              <span>of</span>
              <span className="font-semibold text-[color:var(--ink)]">{casesData.length}</span>
              <span>cases visible</span>
            </div>
          </div>
          <div className="flex min-h-[calc(100vh-14rem)] flex-col lg:flex-row">
            <Sidebar
              options={{
                companies: ALL_COMPANIES,
                industries: ALL_INDUSTRIES,
                categories: ALL_CATEGORIES,
                difficulties: ALL_DIFFICULTIES,
                years: ALL_YEARS,
              }}
              counts={ALL_COUNTS}
              filters={filters}
              setFilters={setFilters}
              totalVisible={filteredCases.length}
              totalAll={casesData.length}
            />
            <CaseGrid cases={filteredCases} filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-screen-2xl px-4 pb-10 pt-4 sm:px-6">
        <div className="rounded-[1.5rem] bg-[#191a23] px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-lg font-semibold text-white">Case Interview Prep</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
            Built on casebooks contributed by IFSA chapters across the DU circuit, 2023–2025.
            We thank every partner chapter for making this library possible.
          </p>
        </div>
      </section>
    </div>
  )
}
