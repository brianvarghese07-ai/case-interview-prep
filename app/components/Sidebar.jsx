'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
    <div className="border-b border-slate-100/90 last:border-b-0">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-50/40 transition-colors"
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
    <label className="flex items-center gap-2.5 px-1.5 py-2 rounded-lg cursor-pointer hover:bg-brand-50/40 group transition-colors">
      <input
        type="checkbox"
        className="rounded border-slate-300 text-brand-600 w-4 h-4 cursor-pointer focus:ring-brand-500"
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
 *   options    – { companies, industries, categories, difficulties, years } all arrays of strings
 *   counts     – { company: {name: count}, ... }
 *   filters    – current selected filters state
 *   setFilters – state setter
 */
export default function Sidebar({ options, counts, filters, setFilters, totalVisible, totalAll }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [mobileOpen])

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
    (filters.difficulties?.length ?? 0) +
    (filters.years?.length ?? 0)

  const clearAll = () =>
    setFilters({ companies: [], industries: [], categories: [], difficulties: [], years: [], search: '' })

  const SidebarContent = () => (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white/70">
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
      <div className="px-4 py-2.5 bg-brand-50/80 border-b border-brand-100">
        <p className="text-xs text-brand-700">
          Showing <span className="font-bold">{totalVisible}</span> of{' '}
          <span className="font-bold">{totalAll}</span> cases
        </p>
      </div>

      {/* Scrollable filter area */}
      <div className="flex-1 overflow-y-auto sidebar-scroll pb-24 lg:pb-0">
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

        {/* Year */}
        <FilterSection title="Casebook Year" defaultOpen={true}>
          {options.years.map((year) => (
            <FilterOption
              key={year}
              label={year}
              count={counts.year?.[year]}
              checked={filters.years?.includes(year) ?? false}
              onChange={() => toggle('years', year)}
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

      <div className="lg:hidden absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 safe-bottom">
        <div className="flex items-center gap-3">
          <button
            onClick={clearAll}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
          >
            Clear all
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="btn-primary flex-1 justify-center py-3"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden px-4 py-2 flex items-center gap-2">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm font-medium border border-slate-200 rounded-xl px-4 py-2.5 bg-white hover:bg-slate-50 transition-colors shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          Filters
          {activeCount > 0 && (
            <span className="badge bg-brand-100 text-brand-700">{activeCount}</span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mounted && mobileOpen && createPortal(
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] rounded-t-[1.75rem] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-center pt-3">
              <div className="h-1.5 w-12 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div>
                <span className="font-semibold text-slate-800">Filters</span>
                <p className="text-xs text-slate-500 mt-0.5">Choose what you want to practice</p>
              </div>
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
      , document.body)}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 bg-white/70 border-r border-slate-200 min-h-[calc(100vh-4rem)] sticky top-16 backdrop-blur-sm">
        <SidebarContent />
      </aside>
    </>
  )
}
