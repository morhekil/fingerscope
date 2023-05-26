import Link from 'next/link'

import { Footer } from '@/app/Footer'
import { Header } from '@/app/Header'
import { Logo } from '@/components/Logo'

import * as store from '@/store'
import { DocumentData } from 'firebase/firestore'

const getScore = (q: any, climbs: any[]): number => {
  const climb = climbs.find((c) => c.climbNo === q.climbNo)
  return climb ? climb.score : 0
}

const getCompetitor = (
  q: any,
  competitors: any[]
): { name: string; category: string } => {
  const competitor = competitors.find((c) => c.no === q.competitorNo)
  return competitor
    ? { name: competitor.name, category: competitor.category }
    : { name: q.competitorNo, category: '??' }
}

const RelScore = ({
  climb,
  minScore,
  quals,
  myCompNo,
}: {
  climb: any
  minScore: number
  quals: any[]
  myCompNo: number
}) => {
  const relScore = climb.score - minScore
  if (relScore === 0) {
    return null
  }

  const myQual = quals.find(
    (q) => q.climbNo === climb.climbNo && q.competitorNo === myCompNo
  )
  if (myQual) {
    return null
  }

  const relScoreStr = relScore > 0 ? `+${relScore}` : relScore
  return (
    <span
      className={`${
        relScore > 0 ? 'text-green-600' : 'text-red-600'
      } font-semibold`}
    >
      {relScoreStr}
    </span>
  )
}

const ClimbedBy = ({ climbNo, quals }: { climbNo: number; quals: any[] }) => {
  // return a list of climbers who have climbed this climb,
  // in small grey text
  const competitors = quals
    .filter((q) => q.climbNo === climbNo)
    .map((q) => `${q.competitor.name} ${q.competitor.category}`)
  const names = competitors.filter(
    (value, index, array) => array.indexOf(value) === index
  )

  if (names.length === 0) {
    return null
  }

  return (
    <span>
      <span className="text-xs">{names.length} sends: </span>
      <span className="text-xs text-gray-500">{names.join(', ')}</span>
    </span>
  )
}

// Show representation of my result - whether this climb is in my top quals,
// or I just climbed it, or haven't climbed it at all
const MyResult = ({
  climb,
  quals,
  myMinQual,
  myCompNo,
}: {
  climb: any
  quals: any[]
  myMinQual: number
  myCompNo: number
}) => {
  const myQual = quals.find(
    (q) => q.climbNo === climb.climbNo && q.competitorNo === myCompNo
  )
  if (!myQual) {
    return <ClimbedBy climbNo={climb.climbNo} quals={quals} />
  }
  if (myQual.score >= myMinQual) {
    return (
      <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        <svg
          className="h-1.5 w-1.5 fill-green-500"
          viewBox="0 0 6 6"
          aria-hidden="true"
        >
          <circle cx={3} cy={3} r={3} />
        </svg>
        QUAL
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
      <svg
        className="h-1.5 w-1.5 fill-gray-600"
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle cx={3} cy={3} r={3} />
      </svg>
      sent
    </span>
  )
}

export default async function Competition({
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
    <div className="lg:ml-72 xl:ml-80">
      <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
        <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
          <div className="hidden lg:flex">
            <Link href="/" aria-label="Home">
              <Logo className="h-6" />
            </Link>
          </div>
          <Header />
        </div>
      </header>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-8">
          <article className="prose">
            <div className="min-w-0 flex-1">
              <h2 className="mt-0 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Comp: <Link href="/">{competition.name}</Link>
              </h2>
              <h3>
                Climber:{' '}
                <Link href={`/${compId}/climbers`}>
                  {myClimber ? (
                    `${myClimber.name}, ${myClimber.category} ${myClimber.no}`
                  ) : (
                    <i>click to select</i>
                  )}
                </Link>
                , ref categories: {refCategories.join(', ')}
              </h3>
            </div>

            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Mark
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {climbs.map((climb) => (
                  <tr key={climb.climbNo}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {climb.marking}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {climb.climbNo}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {climb.score}
                      &nbsp;
                      {myClimber && (
                        <RelScore
                          climb={climb}
                          minScore={myMinQual}
                          quals={quals}
                          myCompNo={myCompNo}
                        />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <MyResult
                        climb={climb}
                        quals={quals}
                        myCompNo={myCompNo}
                        myMinQual={myMinQual}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </main>
        <Footer />
      </div>
    </div>
  )
}
