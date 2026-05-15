import { NextResponse } from 'next/server'
import { getCaseById } from '../../../../lib/cases'
import { buildEvaluationInput, buildMockInterviewBlueprint } from '../../../../lib/mockInterview'

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'

const EVALUATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    overall_score: { type: 'number' },
    summary: { type: 'string' },
    recommendation: { type: 'string' },
    rubric_scores: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          rubric_id: { type: 'string' },
          score: { type: 'number' },
          feedback: { type: 'string' },
        },
        required: ['rubric_id', 'score', 'feedback'],
      },
    },
    strengths: {
      type: 'array',
      items: { type: 'string' },
    },
    next_steps: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['overall_score', 'summary', 'recommendation', 'rubric_scores', 'strengths', 'next_steps'],
}

export async function POST(request) {
  try {
    const body = await request.json()
    const caseId = Number(body?.caseId)
    const transcript = String(body?.transcript ?? '').trim()
    const caseData = getCaseById(caseId)

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found.' }, { status: 404 })
    }

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required.' }, { status: 400 })
    }

    const blueprint = buildMockInterviewBlueprint(caseData)

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        error: 'Missing OPENAI_API_KEY',
        blueprint,
      }, { status: 503 })
    }

    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        instructions:
          'You are an exacting consulting case interview evaluator. Be fair, specific, and concise. Score from 0 to 100.',
        input: buildEvaluationInput(caseData, transcript),
        text: {
          format: {
            type: 'json_schema',
            name: 'case_interview_evaluation',
            strict: true,
            schema: EVALUATION_SCHEMA,
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'OpenAI evaluation request failed.' },
        { status: response.status },
      )
    }

    const rawOutput =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      ''

    return NextResponse.json({
      blueprint,
      evaluation: typeof rawOutput === 'string' ? JSON.parse(rawOutput) : rawOutput,
      responseId: data.id,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate transcript.' },
      { status: 500 },
    )
  }
}
