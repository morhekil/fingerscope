import { DocumentData } from 'firebase/firestore'
import * as store from '@/store'

const getScore = (q: any, climbs: any[]): number => {
  const climb = climbs.find((c) => c.climbNo === q.climbNo)
  return climb ? climb.score : 0
}

const getCompetitor = (
  q: DocumentData,
  competitors: store.Competitor[]
): store.Competitor => {
  const competitor = competitors.find((c) => c.no === q.competitorNo)
  return competitor
    ? {
        no: competitor.no,
        name: competitor.name,
        category: competitor.category,
      }
    : { no: q.competitorNo, name: q.competitorNo, category: '??' }
}

export type Qual = store.Qual & {
  score: number
  competitor: store.Competitor
}

const mergeQuals = (
  quals: store.Qual[],
  climbs: store.Climb[],
  competitors: store.Competitor[]
): Qual[] =>
  quals.map(
    (q): Qual => ({
      ...q,
      score: getScore(q, climbs),
      competitor: getCompetitor(q, competitors),
    })
  )

export default mergeQuals
