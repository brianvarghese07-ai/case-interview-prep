'use client'

import Link from 'next/link'
import { ArrowRight, Building2, Tag, Radio } from 'lucide-react'

const DIFFICULTY_STYLES = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
}

export default function CaseCard({ c }) {
  const diffStyle = DIFFICULTY_STYLES[c.difficulty] ?? DIFFICULTY_STYLES.Medium

  const promptPreview = c.prompt
    ? c.prompt.replace(/\n/g, ' ').slice(0, 132) + (c.prompt.length > 132 ? '...' : '')
    : 'No prompt available.'

  return (
    <Link
      href={`/cases/${c.id}`}
      className="card case-tile flex min-h-[17rem] flex-col p-5 duration-150 group"
    >
      <div className="tile-content flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[color:var(--muted)]">{c.category}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">
              {c.year}
            </span>
          </div>
          <span className={`badge ${diffStyle} flex-shrink-0`}>
            {c.difficulty}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-[0.98rem] font-semibold leading-snug text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--brand)]">
          {c.title}
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-[color:var(--muted)]">
          {promptPreview}
        </p>

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
            <span className="inline-flex items-center gap-1 rounded-lg bg-[color:var(--brand-soft)] px-2.5 py-1.5 text-xs font-semibold text-[color:var(--brand)]">
              Study Case
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-2.5 py-1.5 text-xs font-semibold text-[color:var(--ink-soft)]">
              <Radio className="w-3.5 h-3.5" />
              Practice
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
