import PracticeStudio from '../components/PracticeStudio'
import { getPracticeCategories } from '../../lib/practiceChat'

export const metadata = {
  title: 'Interactive Practice | Case Interview Prep',
  description:
    'Practice profitability, market entry, guesstimate, and other case types in an interviewer-style chat.',
}

export default function PracticePage() {
  const categories = getPracticeCategories()

  return <PracticeStudio categories={categories} />
}
