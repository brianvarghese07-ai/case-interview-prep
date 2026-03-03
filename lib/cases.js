import casesData from '../public/data/cases.json'

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard']

function bucketByThirds(score) {
  if (score <= 1 / 3) return 'Easy'
  if (score <= 2 / 3) return 'Medium'
  return 'Hard'
}

function extractSectionIndex(c) {
  const match = String(c.sourceSection ?? '').match(/-\s*(\d+)\s*$/)
  return match ? Number(match[1]) : null
}

function normalizeDifficulty(cases) {
  // Group by category so each track (e.g., Guesstimate, Profitability) gets its own spectrum.
  const byCategory = new Map()
  for (const c of cases) {
    const key = c.category ?? 'Unknown'
    if (!byCategory.has(key)) byCategory.set(key, [])
    byCategory.get(key).push(c)
  }

  const mapped = []

  for (const [category, group] of byCategory.entries()) {
    const indices = group.map(extractSectionIndex).filter((n) => Number.isFinite(n))
    const minIdx = indices.length ? Math.min(...indices) : 1
    const maxIdx = indices.length ? Math.max(...indices) : group.length
    const span = Math.max(1, maxIdx - minIdx)

    for (let i = 0; i < group.length; i += 1) {
      const c = group[i]
      const idx = extractSectionIndex(c)
      const normalizedScore = Number.isFinite(idx)
        ? (idx - minIdx) / span
        : group.length > 1
          ? i / (group.length - 1)
          : 0.5

      mapped.push({
        ...c,
        difficultyScore: Number(normalizedScore.toFixed(4)),
        difficulty: bucketByThirds(normalizedScore),
        difficultySource: Number.isFinite(idx) ? 'section-index' : 'category-order',
        difficultyCategory: category,
      })
    }
  }

  return mapped.sort((a, b) => a.id - b.id)
}

const NORMALIZED_CASES = normalizeDifficulty(casesData)

/**
 * Returns all cases with optional filtering.
 *
 * @param {Object} filters
 * @param {string}   filters.search      – full-text search (title, prompt, industry)
 * @param {string[]} filters.companies   – array of company names to include
 * @param {string[]} filters.industries  – array of industries to include
 * @param {string[]} filters.categories  – array of categories to include
 * @param {string[]} filters.difficulties – array of difficulties to include
 * @returns {Array} filtered case objects
 */
export function getCases(filters = {}) {
  const { search, companies, industries, categories, difficulties } = filters

  return NORMALIZED_CASES.filter((c) => {
    if (companies?.length && !companies.includes(c.company)) return false
    if (industries?.length && !industries.includes(c.industry)) return false
    if (categories?.length && !categories.includes(c.category)) return false
    if (difficulties?.length && !difficulties.includes(c.difficulty)) return false
    if (search) {
      const q = search.toLowerCase()
      const haystack = `${c.title} ${c.company} ${c.industry} ${c.prompt}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

/** Returns a single case by numeric id. */
export function getCaseById(id) {
  return NORMALIZED_CASES.find((c) => c.id === Number(id)) ?? null
}

/** Returns a single case by slug. */
export function getCaseBySlug(slug) {
  return NORMALIZED_CASES.find((c) => c.slug === slug) ?? null
}

/** Returns sorted unique values for a given field. */
export function getFilterOptions(field) {
  const vals = [...new Set(NORMALIZED_CASES.map((c) => c[field]).filter(Boolean))]
  return vals.sort()
}

/** Returns total case count. */
export function getCaseCount() {
  return NORMALIZED_CASES.length
}

/** Returns all cases after difficulty normalization. */
export function getAllCases() {
  return NORMALIZED_CASES
}

/** Returns the ordered difficulty buckets and their cutoffs. */
export function getDifficultySchema() {
  return {
    levels: DIFFICULTY_LEVELS,
    cutoffs: {
      easyMax: 1 / 3,
      mediumMax: 2 / 3,
      hardMax: 1,
    },
  }
}
