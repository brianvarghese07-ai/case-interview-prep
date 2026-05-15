import { notFound } from 'next/navigation'
import MockInterviewStudio from '../../components/MockInterviewStudio'
import { getAllCases } from '../../../lib/cases'
import { buildMockInterviewBlueprint } from '../../../lib/mockInterview'

const casesData = getAllCases()

export async function generateStaticParams() {
  return casesData.map((c) => ({ id: String(c.id) }))
}

export async function generateMetadata({ params }) {
  const c = casesData.find((x) => x.id === Number(params.id))
  if (!c) return { title: 'Mock Interview Not Found' }

  return {
    title: `${c.title} Mock Interview | Case Interview Prep`,
    description: `Run a live mock interview flow for ${c.title}.`,
  }
}

export default function MockInterviewPage({ params }) {
  const c = casesData.find((x) => x.id === Number(params.id))
  if (!c) notFound()

  const blueprint = buildMockInterviewBlueprint(c)

  return <MockInterviewStudio c={c} blueprint={blueprint} />
}
