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
      <div className="sticky top-16 z-30 bg-white/70 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search cases, companies, industries…"
            value={filters.search ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/95 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-slate-400 transition-shadow"
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 flex-shrink-0 hidden sm:block">
          <span className="font-semibold text-slate-800">{sorted.length}</span> cases
        </p>

        {/* View toggle */}
        <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid / List */}
      <div className="p-4 sm:p-6 flex-1">
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
                setFilters({ companies: [], industries: [], categories: [], difficulties: [], search: '' })
              }
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {sorted.map((c) => (
              <CaseCard key={c.id} c={c} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-w-4xl">
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
  Easy:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50  text-amber-700  border-amber-200',
  Hard:   'bg-red-50    text-red-700    border-red-200',
}

function ListRow({ c }) {
  return (
    <Link
      href={`/cases/${c.id}`}
      className="card px-5 py-3.5 flex items-center gap-4 hover:shadow-md hover:border-brand-200 transition-all duration-200 group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="text-xs text-slate-400">{c.category}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs font-medium text-slate-600">{c.company}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">{c.industry}</span>
        </div>
        <p className="font-medium text-sm text-slate-900 group-hover:text-brand-700 truncate transition-colors">
          {c.title}
        </p>
      </div>
      <span className={`badge border flex-shrink-0 ${DIFF_STYLES[c.difficulty] ?? DIFF_STYLES.Medium}`}>
        {c.difficulty}
      </span>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
    </Link>
  )
}
