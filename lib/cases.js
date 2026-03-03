import casesData from '../public/data/cases.json'

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

  return casesData.filter((c) => {
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
  return casesData.find((c) => c.id === Number(id)) ?? null
}

/** Returns a single case by slug. */
export function getCaseBySlug(slug) {
  return casesData.find((c) => c.slug === slug) ?? null
}

/** Returns sorted unique values for a given field. */
export function getFilterOptions(field) {
  const vals = [...new Set(casesData.map((c) => c[field]).filter(Boolean))]
  return vals.sort()
}

/** Returns total case count. */
export function getCaseCount() {
  return casesData.length
}
