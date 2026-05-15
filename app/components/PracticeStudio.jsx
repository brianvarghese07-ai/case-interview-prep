'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpenText,
  Brain,
  MessageSquareQuote,
  Send,
  Sparkles,
} from 'lucide-react'

function PracticeCategoryCard({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[1.4rem] border p-4 text-left transition-all duration-150 ${
        active
          ? 'border-brand-300 bg-brand-50 shadow-[0_18px_34px_rgba(15,91,216,0.12)]'
          : 'border-[color:var(--border)] bg-[color:var(--surface)] hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_16px_26px_rgba(15,42,90,0.08)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[color:var(--ink)]">{item.name}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">{item.count} cases available</p>
        </div>
        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white">
          Chat
        </span>
      </div>
    </button>
  )
}

function MessageBubble({ message }) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[88%] rounded-[1.4rem] px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isAssistant
            ? 'border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--ink-soft)]'
            : 'bg-slate-950 text-white'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

export default function PracticeStudio({ categories }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name ?? '')
  const [activeCase, setActiveCase] = useState(null)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Pick a case type and start with a prompt. I’ll act like the interviewer and keep the dialogue case-style rather than giving away the answer.',
    },
  ])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const activeCategory = useMemo(
    () => categories.find((item) => item.name === selectedCategory) ?? categories[0],
    [categories, selectedCategory],
  )

  async function sendMessage(content) {
    if (!content.trim() || loading || !activeCategory) return

    const nextMessages = [...messages, { role: 'user', content: content.trim() }]
    setMessages(nextMessages)
    setDraft('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/practice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory.name,
          caseId: activeCase?.id ?? null,
          messages: nextMessages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to continue the case dialogue.')
      }

      if (data.case) {
        setActiveCase(data.case)
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message || 'Something went wrong while talking to Gemini.')
    } finally {
      setLoading(false)
    }
  }

  function changeCategory(name) {
    setSelectedCategory(name)
    setActiveCase(null)
    setError('')
    setMessages([
      {
        role: 'assistant',
        content: `You’re in ${name} mode now. Choose a starter prompt and I’ll begin a fresh interviewer-style case.`,
      },
    ])
    setDraft('')
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <section className="practice-hero-panel">
        <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-brand-200/40 blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="practice-hero-badge">
              <MessageSquareQuote className="h-3.5 w-3.5" />
              Interactive practice chat
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-[color:var(--ink)] sm:text-5xl">
              Practice cases as a real dialogue
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--ink-soft)] sm:text-base">
              Pick a case type like profitability, market entry, or guesstimate, then work through it in chat.
              The assistant stays in interviewer mode and uses the casebook as grounding instead of giving instant textbook answers.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem]">
            {[
              { icon: BookOpenText, label: 'Grounded on casebook data' },
              { icon: Brain, label: 'Gemini 2.5 Flash ready' },
              { icon: Sparkles, label: 'Dark mode included' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="practice-feature-tile">
                  <Icon className="h-4 w-4 practice-feature-icon" />
                  <p className="mt-2 text-xs font-semibold text-[color:var(--ink-soft)]">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Case types</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[color:var(--ink)]">Choose your practice lane</h2>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm font-medium text-[color:var(--ink-soft)] transition-colors hover:text-brand-700"
              >
                Browse cases
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3">
              {categories.map((item) => (
                <PracticeCategoryCard
                  key={item.name}
                  item={item}
                  active={item.name === activeCategory?.name}
                  onClick={() => changeCategory(item.name)}
                />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Starter prompts</p>
            <h3 className="mt-1 font-display text-xl font-bold text-[color:var(--ink)]">{activeCategory?.name}</h3>
            <div className="mt-4 grid gap-3">
              {activeCategory?.starters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => sendMessage(starter)}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-left text-sm leading-relaxed text-[color:var(--ink-soft)] transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_16px_26px_rgba(15,42,90,0.08)]"
                >
                  {starter}
                </button>
              ))}
            </div>

            {activeCase && (
              <div className="mt-5 rounded-[1.4rem] border border-brand-200 bg-brand-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Current case</p>
                <p className="mt-2 font-semibold text-[color:var(--ink)]">{activeCase.title}</p>
                <p className="mt-1 text-sm text-[color:var(--ink-soft)]">
                  {activeCase.company} · {activeCase.industry} · {activeCase.difficulty}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-[color:var(--border)] bg-[color:var(--surface)]/80 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Dialogue studio</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[color:var(--ink)]">
              {activeCategory?.name} practice
            </h2>
          </div>

          <div className="space-y-4 px-4 py-5 sm:px-5 sm:py-6 min-h-[34rem] max-h-[42rem] overflow-y-auto">
            {messages.map((message, index) => (
              <MessageBubble key={`${message.role}-${index}`} message={message} />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--muted)] shadow-sm">
                  Gemini is thinking through the next interviewer response...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 sm:px-5">
            {error && (
              <p className="mb-3 text-sm font-medium text-red-600">{error}</p>
            )}
            <div className="flex items-end gap-3">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type your clarifying question, structure, or recommendation..."
                className="min-h-[5.5rem] flex-1 resize-none rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--ink)] outline-none transition-shadow placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                disabled={loading || !draft.trim()}
                onClick={() => sendMessage(draft)}
                className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-55"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
