'use client'

import { useState, useMemo } from 'react'
import { Search, BookOpen, LayoutGrid, List } from 'lucide-react'
import CaseCard from './CaseCard'

export default function CaseGrid({ cases, filters, setFilters }) {
  const [view, setView] = useState('grid') // 'grid' | 'list'

  const sorted = useMemo(() => [...cases].sort((a, b) => a.id - b.id), [cases])

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 flex flex-wrap items-center gap-2 border-b border-[color:var(--border)] bg-[color:var(--surface-3)] px-4 py-3 backdrop-blur-xl sm:px-6 sm:gap-3">
        {/* Search */}
        <div className="relative flex-[1_1_100%] sm:flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search cases, companies, industries, years…"
            value={filters.search ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] py-2.5 pl-9 pr-4 text-sm text-[color:var(--ink)] transition-shadow placeholder:text-[color:var(--muted)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Results count */}
        <p className="text-xs sm:text-sm text-[color:var(--muted)] flex-shrink-0">
          <span className="font-semibold text-[color:var(--ink)]">{sorted.length}</span> cases
        </p>

        {/* View toggle */}
        <div className="flex items-center gap-0.5 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-0.5 shadow-sm">
          <button
            onClick={() => setView('grid')}
            className={`rounded p-1.5 transition-colors ${view === 'grid' ? 'bg-brand-600 text-white' : 'text-[color:var(--muted)] hover:text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]'}`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`rounded p-1.5 transition-colors ${view === 'list' ? 'bg-brand-600 text-white' : 'text-[color:var(--muted)] hover:text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]'}`}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid / List */}
      <div className="flex-1 p-3 sm:p-5">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700">No cases found</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
            <button
              onClick={() =>
                setFilters({ companies: [], industries: [], categories: [], difficulties: [], years: [], search: '' })
              }
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {sorted.map((c) => (
              <CaseCard key={c.id} c={c} />
            ))}
          </div>
        ) : (
          <div className="flex max-w-5xl flex-col gap-2">
            {sorted.map((c) => (
              <ListRow key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Compact list row for list-view mode */
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const DIFF_STYLES = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
}

function ListRow({ c }) {
  return (
    <Link
      href={`/cases/${c.id}`}
      className="card case-tile flex items-center gap-3 px-4 py-3.5 transition-all duration-150 group sm:gap-4 sm:px-5"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="text-xs text-[color:var(--muted)]">{c.category}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-[color:var(--muted)]">{c.year}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs font-medium text-[color:var(--ink-soft)]">{c.company}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-[color:var(--muted)]">{c.industry}</span>
        </div>
        <p className="truncate text-sm font-medium text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--brand)]">
          {c.title}
        </p>
      </div>
      <span className={`badge flex-shrink-0 hidden sm:inline-flex ${DIFF_STYLES[c.difficulty] ?? DIFF_STYLES.Medium}`}>
        {c.difficulty}
      </span>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
    </Link>
  )
}
