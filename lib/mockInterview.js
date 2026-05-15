const DEFAULT_RUBRIC = [
  {
    id: 'problem-framing',
    label: 'Problem framing',
    weight: 20,
    focus: 'Clarifies the goal, scope, success metric, and constraints before solving.',
  },
  {
    id: 'structure',
    label: 'Structure',
    weight: 25,
    focus: 'Builds a clean, MECE-style approach and signposts the path clearly.',
  },
  {
    id: 'quantitative-rigor',
    label: 'Quantitative rigor',
    weight: 20,
    focus: 'Uses assumptions carefully, sanity-checks math, and connects numbers to decisions.',
  },
  {
    id: 'business-judgment',
    label: 'Business judgment',
    weight: 20,
    focus: 'Prioritizes the right drivers, surfaces tradeoffs, and stays commercially grounded.',
  },
  {
    id: 'communication',
    label: 'Communication',
    weight: 15,
    focus: 'Speaks crisply, drives the conversation, and lands a clear recommendation.',
  },
]

function cleanSentence(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim()
}

function splitSolutionTurns(solution) {
  return String(solution ?? '')
    .split('\n')
    .map((line) => cleanSentence(line))
    .filter(Boolean)
}

function inferClarifyingQuestions(solution) {
  return splitSolutionTurns(solution)
    .filter((line) => line.includes('?'))
    .slice(0, 6)
}

function inferRevealFacts(prompt, solution) {
  const promptSentences = String(prompt ?? '')
    .split(/(?<=[.!?])\s+/)
    .map(cleanSentence)
    .filter(Boolean)

  const shortSolutionFacts = splitSolutionTurns(solution)
    .filter((line) => !line.includes('?') && line.length > 25 && line.length < 180)
    .slice(0, 4)

  return [...promptSentences.slice(0, 2), ...shortSolutionFacts].slice(0, 6)
}

function buildCallStages(caseData) {
  return [
    {
      id: 'opening',
      title: 'Opening prompt',
      description: 'Interviewer reads the case and waits for clarifying questions before offering more facts.',
    },
    {
      id: 'structure',
      title: 'Candidate structure',
      description: `Student should outline a path for the ${caseData.category.toLowerCase()} case before going deeper.`,
    },
    {
      id: 'analysis',
      title: 'Analysis sprint',
      description: 'Interviewer drip-feeds data only when the student asks relevant questions or advances the logic.',
    },
    {
      id: 'recommendation',
      title: 'Recommendation close',
      description: 'Student synthesizes answer, risks, and next steps in a partner-style final recommendation.',
    },
  ]
}

export function buildMockInterviewBlueprint(caseData) {
  const clarifyingQuestions = inferClarifyingQuestions(caseData.solution)
  const revealFacts = inferRevealFacts(caseData.prompt, caseData.solution)

  return {
    caseId: caseData.id,
    title: caseData.title,
    company: caseData.company,
    industry: caseData.industry,
    category: caseData.category,
    difficulty: caseData.difficulty,
    opener: cleanSentence(caseData.prompt),
    format: {
      mode: 'voice_mock_interview',
      durationMinutes: caseData.category === 'Guesstimate' ? 18 : 25,
      interviewerStyle: 'professional, calm, lightly challenging',
    },
    interviewerObjectives: [
      'Keep the interaction realistic and candidate-led rather than lecture-style.',
      'Reveal information only when the student asks sensible questions or completes a step.',
      'Push for clearer structure whenever the student becomes too vague or too detailed.',
      'Close with a recommendation, key risks, and next steps.',
    ],
    likelyClarifyingQuestions: clarifyingQuestions.length
      ? clarifyingQuestions
      : [
          'Can I clarify the scope and objective before I begin?',
          'Are there any constraints or definitions I should keep in mind?',
        ],
    revealFacts,
    callStages: buildCallStages(caseData),
    scoringRubric: DEFAULT_RUBRIC,
  }
}

export function buildRealtimeInstructions(caseData) {
  const blueprint = buildMockInterviewBlueprint(caseData)

  return `
You are running a live consulting mock interview for a student.

Case:
- Title: ${blueprint.title}
- Company: ${blueprint.company}
- Industry: ${blueprint.industry}
- Type: ${blueprint.category}
- Difficulty: ${blueprint.difficulty}

Opening prompt:
${blueprint.opener}

Behavior rules:
- Speak like a real consulting interviewer on a live mock call.
- Start by reading only the opening prompt.
- Do not dump the full solution or all facts at once.
- Let the candidate drive with clarifying questions and structure.
- Reveal information gradually, and only when it is earned by the flow of the discussion.
- Push the candidate to be structured, quantitative, and commercially grounded.
- If the candidate gets stuck, give a light nudge rather than solving the case for them.
- End by asking for a final recommendation with risks and next steps.
`.trim()
}

export function buildEvaluationInput(caseData, transcript) {
  const blueprint = buildMockInterviewBlueprint(caseData)

  return `
Evaluate this consulting case interview transcript.

Case metadata:
- Title: ${blueprint.title}
- Company: ${blueprint.company}
- Industry: ${blueprint.industry}
- Type: ${blueprint.category}
- Difficulty: ${blueprint.difficulty}

Opening prompt:
${blueprint.opener}

Rubric:
${blueprint.scoringRubric.map((item) => `- ${item.label} (${item.weight}%): ${item.focus}`).join('\n')}

Transcript:
${transcript}
`.trim()
}
