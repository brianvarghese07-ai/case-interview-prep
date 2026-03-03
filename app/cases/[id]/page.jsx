import { notFound } from 'next/navigation'
import casesData from '../../../public/data/cases.json'
import CasePractice from '../../components/CasePractice'

export async function generateStaticParams() {
  return casesData.map((c) => ({ id: String(c.id) }))
}

export async function generateMetadata({ params }) {
  const c = casesData.find((x) => x.id === Number(params.id))
  if (!c) return { title: 'Case Not Found' }
  return {
    title: `${c.title} | Case Interview Prep`,
    description: c.prompt?.slice(0, 150),
  }
}

export default function CaseDetailPage({ params }) {
  const c = casesData.find((x) => x.id === Number(params.id))
  if (!c) notFound()

  // Find prev/next cases for navigation
  const idx  = casesData.findIndex((x) => x.id === c.id)
  const prev = casesData[idx - 1] ?? null
  const next = casesData[idx + 1] ?? null

  return <CasePractice c={c} prev={prev} next={next} total={casesData.length} />
}
