'use client'

import Link from 'next/link'
import { ArrowRight, Building2, Tag, Radio } from 'lucide-react'

const DIFFICULTY_STYLES = {
  Easy:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50  text-amber-700  border-amber-200',
  Hard:   'bg-red-50    text-red-700    border-red-200',
}

const CATEGORY_ACCENT = {
  Guesstimate:              'border-l-violet-400',
  Profitability:            'border-l-blue-400',
  'Market Entry':           'border-l-cyan-400',
  'Market Growth & Sizing': 'border-l-teal-400',
  'Pricing Strategy':       'border-l-orange-400',
  Unconventional:           'border-l-pink-400',
}

const CATEGORY_ICONS = {
  Guesstimate:              '🔢',
  Profitability:            '📉',
  'Market Entry':           '🚀',
  'Market Growth & Sizing': '📈',
  'Pricing Strategy':       '💰',
  Unconventional:           '🎯',
}

export default function CaseCard({ c }) {
  const diffStyle    = DIFFICULTY_STYLES[c.difficulty] ?? DIFFICULTY_STYLES.Medium
  const categoryBorder = CATEGORY_ACCENT[c.category] ?? 'border-l-slate-300'
  const icon         = CATEGORY_ICONS[c.category] ?? '📋'

  const promptPreview = c.prompt
    ? c.prompt.replace(/\n/g, ' ').slice(0, 140) + (c.prompt.length > 140 ? '…' : '')
    : 'No prompt available.'

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    event.currentTarget.style.setProperty('--mx', `${x}px`)
    event.currentTarget.style.setProperty('--my', `${y}px`)
  }

  return (
    <Link
      href={`/cases/${c.id}`}
      className={`card case-tile border-l-4 ${categoryBorder} p-5 flex flex-col gap-4 duration-150 group`}
      onMouseMove={handleMouseMove}
    >
      <div className="tile-content">
        {/* Top Row: Category + Difficulty */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[color:var(--muted)] flex items-center gap-1">
              <span>{icon}</span>
              {c.category}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {c.year}
            </span>
          </div>
          <span className={`badge border ${diffStyle} flex-shrink-0 shadow-sm`}>
            {c.difficulty}
          </span>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h3 className="font-semibold text-[color:var(--ink)] text-[0.95rem] leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
            {c.title}
          </h3>
        </div>

        {/* Prompt preview */}
        <p className="mt-3 text-xs text-[color:var(--muted)] leading-relaxed line-clamp-3 flex-1">
          {promptPreview}
        </p>

        {/* Footer: company + industry + CTA */}
        <div className="mt-4 pt-3 border-t border-[color:var(--border)]">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-xs text-[color:var(--muted)]">
              <Building2 className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium text-[color:var(--ink-soft)] truncate max-w-[130px]">{c.company}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[color:var(--muted)]">
              <Tag className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[130px]">{c.industry}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
              Study Case
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs font-semibold text-[color:var(--ink-soft)]">
              <Radio className="w-3.5 h-3.5" />
              Practice Chat
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
