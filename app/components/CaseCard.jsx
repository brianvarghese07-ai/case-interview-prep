import Link from 'next/link'
import { ArrowRight, Building2, Tag, BarChart2 } from 'lucide-react'

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

  return (
    <Link
      href={`/cases/${c.id}`}
      className={`card border-l-4 ${categoryBorder} p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}
    >
      {/* Top Row: Category + Difficulty */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <span>{icon}</span>
          {c.category}
        </span>
        <span className={`badge border ${diffStyle} flex-shrink-0`}>
          {c.difficulty}
        </span>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-slate-900 text-[0.95rem] leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
          {c.title}
        </h3>
      </div>

      {/* Prompt preview */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
        {promptPreview}
      </p>

      {/* Footer: company + industry + CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Building2 className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium text-slate-700 truncate max-w-[130px]">{c.company}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Tag className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[130px]">{c.industry}</span>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
          Practice
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}
