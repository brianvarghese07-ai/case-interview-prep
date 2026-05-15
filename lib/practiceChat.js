import { getAllCases, getCaseById } from './cases'

const CATEGORY_STARTERS = {
  Profitability: [
    'Give me a profitability case and act like the interviewer.',
    'Start a profitability case and wait for my clarifying questions.',
  ],
  'Market Entry': [
    'Give me a market entry case and interview me step by step.',
    'Start a market entry case and challenge my structure.',
  ],
  Guesstimate: [
    'Give me a guesstimate case and act like a real interviewer.',
    'Start a guesstimate and push me to explain assumptions clearly.',
  ],
  'Market Growth & Sizing': [
    'Give me a market sizing case and interview me step by step.',
  ],
  'Pricing Strategy': [
    'Give me a pricing strategy case and challenge my logic.',
  ],
  Unconventional: [
    'Give me an unconventional case and keep the dialogue realistic.',
  ],
}

export function getPracticeCategories() {
  const counts = {}

  for (const c of getAllCases()) {
    counts[c.category] = (counts[c.category] ?? 0) + 1
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      starters: CATEGORY_STARTERS[name] ?? [
        `Give me a ${name.toLowerCase()} case and act like the interviewer.`,
      ],
    }))
}

export function getRandomCaseForCategory(category) {
  const matches = getAllCases().filter((c) => c.category === category)
  if (!matches.length) return null

  const index = Math.floor(Math.random() * matches.length)
  return matches[index]
}

export function getPracticeCaseById(id) {
  return getCaseById(id)
}

export function buildGeminiPracticePrompt(caseData) {
  return `
You are a consulting case interviewer helping a student practice through dialogue.

Case metadata:
- Title: ${caseData.title}
- Company: ${caseData.company}
- Industry: ${caseData.industry}
- Category: ${caseData.category}
- Difficulty: ${caseData.difficulty}

Opening prompt:
${caseData.prompt}

Reference solution and patterns from the casebook:
${caseData.solution}

Rules:
- Behave like a real consulting interviewer, not a tutor giving everything away.
- Start by giving only the case prompt unless the conversation is already underway.
- Let the candidate ask clarifying questions and drive the structure.
- Reveal information gradually and naturally.
- Push for structure, sound assumptions, and commercial reasoning.
- Do not dump the full reference solution.
- If the candidate asks for feedback, give concise interview-style feedback.
- Keep answers conversational and reasonably short, usually 2 to 6 sentences unless more detail is needed.
`.trim()
}

export function formatGeminiContents(messages) {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }))
}
