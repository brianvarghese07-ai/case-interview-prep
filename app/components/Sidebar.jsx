'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react'

const DIFFICULTY_COLORS = {
  Easy:   'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100   text-red-700',
}

const CATEGORY_ICONS = {
  Guesstimate:           '🔢',
  Profitability:         '📉',
  'Market Entry':        '🚀',
  'Market Growth & Sizing': '📈',
  'Pricing Strategy':    '💰',
  Unconventional:        '🎯',
}

/** A collapsible filter section */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>
      {open && <div className="px-3 pb-3 space-y-1">{children}</div>}
    </div>
  )
}

/** A single filter pill/checkbox row */
function FilterOption({ label, checked, count, colorClass, icon, onChange }) {
  return (
    <label className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 group transition-colors">
      <input
        type="checkbox"
        className="rounded border-slate-300 text-brand-600 w-3.5 h-3.5 cursor-pointer focus:ring-brand-500"
        checked={checked}
        onChange={onChange}
      />
      <span className="flex-1 flex items-center gap-1.5 text-sm text-slate-700 group-hover:text-slate-900">
        {icon && <span>{icon}</span>}
        {colorClass ? (
          <span className={`badge ${colorClass}`}>{label}</span>
        ) : (
          label
        )}
      </span>
      {count !== undefined && (
        <span className="text-xs text-slate-400 font-medium">{count}</span>
      )}
    </label>
  )
}

/**
 * Sidebar
 *
 * Props:
 *   options    – { companies, industries, categories, difficulties } all arrays of strings
 *   counts     – { company: {name: count}, ... }
 *   filters    – current selected filters state
 *   setFilters – state setter
 */
export default function Sidebar({ options, counts, filters, setFilters, totalVisible, totalAll }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggle = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] ?? []
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const activeCount =
    (filters.companies?.length ?? 0) +
    (filters.industries?.length ?? 0) +
    (filters.categories?.length ?? 0) +
    (filters.difficulties?.length ?? 0)

  const clearAll = () =>
    setFilters({ companies: [], industries: [], categories: [], difficulties: [], search: '' })

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span className="font-semibold text-sm text-slate-800">Filters</span>
          {activeCount > 0 && (
            <span className="badge bg-brand-100 text-brand-700">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Case count */}
      <div className="px-4 py-2.5 bg-brand-50 border-b border-brand-100">
        <p className="text-xs text-brand-700">
          Showing <span className="font-bold">{totalVisible}</span> of{' '}
          <span className="font-bold">{totalAll}</span> cases
        </p>
      </div>

      {/* Scrollable filter area */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {/* Category */}
        <FilterSection title="Case Type">
          {options.categories.map((cat) => (
            <FilterOption
              key={cat}
              label={cat}
              icon={CATEGORY_ICONS[cat]}
              count={counts.category?.[cat]}
              checked={filters.categories?.includes(cat) ?? false}
              onChange={() => toggle('categories', cat)}
            />
          ))}
        </FilterSection>

        {/* Difficulty */}
        <FilterSection title="Difficulty">
          {options.difficulties.map((d) => (
            <FilterOption
              key={d}
              label={d}
              colorClass={DIFFICULTY_COLORS[d]}
              count={counts.difficulty?.[d]}
              checked={filters.difficulties?.includes(d) ?? false}
              onChange={() => toggle('difficulties', d)}
            />
          ))}
        </FilterSection>

        {/* Company */}
        <FilterSection title="Company" defaultOpen={true}>
          {options.companies.map((co) => (
            <FilterOption
              key={co}
              label={co}
              count={counts.company?.[co]}
              checked={filters.companies?.includes(co) ?? false}
              onChange={() => toggle('companies', co)}
            />
          ))}
        </FilterSection>

        {/* Industry */}
        <FilterSection title="Industry" defaultOpen={false}>
          {options.industries.map((ind) => (
            <FilterOption
              key={ind}
              label={ind}
              count={counts.industry?.[ind]}
              checked={filters.industries?.includes(ind) ?? false}
              onChange={() => toggle('industries', ind)}
            />
          ))}
        </FilterSection>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden px-4 py-2 flex items-center gap-2">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm font-medium border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          Filters
          {activeCount > 0 && (
            <span className="badge bg-brand-100 text-brand-700">{activeCount}</span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Filters</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] sticky top-14">
        <SidebarContent />
      </aside>
    </>
  )
}
