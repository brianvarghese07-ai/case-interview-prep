import { NextResponse } from 'next/server'
import {
  buildGeminiPracticePrompt,
  formatGeminiContents,
  getPracticeCaseById,
  getRandomCaseForCategory,
} from '../../../lib/practiceChat'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function POST(request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body?.messages) ? body.messages : []
    const category = String(body?.category ?? '').trim()
    const providedCaseId = body?.caseId ? Number(body.caseId) : null

    if (!category) {
      return NextResponse.json({ error: 'Category is required.' }, { status: 400 })
    }

    if (!messages.length) {
      return NextResponse.json({ error: 'At least one message is required.' }, { status: 400 })
    }

    const caseData = providedCaseId
      ? getPracticeCaseById(providedCaseId)
      : getRandomCaseForCategory(category)

    if (!caseData) {
      return NextResponse.json({ error: 'Could not find a case for that category.' }, { status: 404 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing GEMINI_API_KEY. Add it to your environment to enable the practice chat.' },
        { status: 503 },
      )
    }

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: buildGeminiPracticePrompt(caseData) }],
        },
        contents: formatGeminiContents(messages),
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 600,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Gemini request failed.' },
        { status: response.status },
      )
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('\n')
      .trim()

    if (!reply) {
      return NextResponse.json({ error: 'Gemini returned an empty response.' }, { status: 502 })
    }

    return NextResponse.json({
      reply,
      case: {
        id: caseData.id,
        title: caseData.title,
        company: caseData.company,
        industry: caseData.industry,
        category: caseData.category,
        difficulty: caseData.difficulty,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to continue the practice chat.' },
      { status: 500 },
    )
  }
}
