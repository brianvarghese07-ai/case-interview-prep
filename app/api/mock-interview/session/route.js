import { NextResponse } from 'next/server'
import { getCaseById } from '../../../../lib/cases'
import { buildMockInterviewBlueprint, buildRealtimeInstructions } from '../../../../lib/mockInterview'

const OPENAI_REALTIME_URL = 'https://api.openai.com/v1/realtime/client_secrets'

export async function POST(request) {
  try {
    const body = await request.json()
    const caseId = Number(body?.caseId)
    const caseData = getCaseById(caseId)

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found.' }, { status: 404 })
    }

    const blueprint = buildMockInterviewBlueprint(caseData)
    const instructions = buildRealtimeInstructions(caseData)

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        blueprint,
        realtime: {
          enabled: false,
          reason: 'Missing OPENAI_API_KEY',
        },
      })
    }

    const response = await fetch(OPENAI_REALTIME_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model: 'gpt-realtime-mini',
          instructions,
          audio: {
            output: {
              voice: 'marin',
            },
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || 'OpenAI Realtime session request failed.',
          blueprint,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      blueprint,
      realtime: {
        enabled: true,
        clientSecret: data.client_secret?.value ?? data.session?.client_secret?.value ?? null,
        expiresAt: data.expires_at ?? data.client_secret?.expires_at ?? data.session?.client_secret?.expires_at ?? null,
        session: data.session ?? null,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create mock interview session.' },
      { status: 500 },
    )
  }
}
