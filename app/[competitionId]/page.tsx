import * as store from '@/store'
import { DocumentData } from 'firebase/firestore'
import Competition from './Competition'

const getScore = (q: any, climbs: any[]): number => {
  const climb = climbs.find((c) => c.climbNo === q.climbNo)
  return climb ? climb.score : 0
}

const getCompetitor = (
  q: DocumentData,
  competitors: store.Competitor[]
): { name: string; category: string } => {
  const competitor = competitors.find((c) => c.no === q.competitorNo)
  return competitor
    ? { name: competitor.name, category: competitor.category }
    : { name: q.competitorNo, category: '??' }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { competitionId: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const compId = params.competitionId
  const competition = await store.competition(compId)
  const climbs = await store.climbs(compId)

  const allCompetitors = await store.competitors(compId)

  const climber = (searchParams || {})['climber']
  const myCompNo = parseInt(climber?.toString() || '0')
  const myClimber = allCompetitors.find((c) => c.no === myCompNo)
  const refCategories =
    !myClimber || myClimber.category == 'MM'
      ? ['MM', 'OBW']
      : ['MM', 'OBW', myClimber.category]

  const myCompetitors = allCompetitors.filter((c) =>
    refCategories.includes(c.category)
  )

  const quals: DocumentData[] = (await store.quals(compId))
    .filter((q) => refCategories.includes(q.category))
    .map((q) => ({
      ...q,
      score: getScore(q, climbs),
      competitor: getCompetitor(q, myCompetitors),
    }))
  const myTopQuals = quals
    .filter((q) => q.competitorNo === myCompNo)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
  const myMinQual =
    myTopQuals.length > 0 ? Math.min(...myTopQuals.map((q) => q.score)) : 0

  return (
    <Competition
      competition={competition}
      quals={quals}
      myClimber={myClimber}
      refCategories={refCategories}
      climbs={climbs}
    />
  )
}
