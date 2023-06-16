import * as store from '@/store'
import mergeQuals from '@/components/quals'

import Competition from './Competition'

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

  const refQuals = (await store.quals(compId)).filter((q) =>
    refCategories.includes(q.category)
  )

  const quals = mergeQuals(refQuals, climbs, allCompetitors)

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
