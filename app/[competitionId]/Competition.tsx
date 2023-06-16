'use client'
import Link from 'next/link'

import { Footer } from '@/app/Footer'
import { Header } from '@/app/Header'

import * as store from '@/store'
import ReloadPageButton from '@/components/ReloadPageButton'
import { ChangeEventHandler, memo, useMemo, useState } from 'react'
import { Qual } from '@/components/quals'

const Climb = memo(
  ({
    climb,
    myClimber,
    myMinQual,
    quals,
  }: {
    climb: store.Climb
    myClimber?: store.Competitor
    myMinQual: number
    quals: Qual[]
  }) => (
    <tr key={climb.climbNo} id={`climbno-${climb.climbNo}`}>
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
            myCompNo={myClimber.no}
          />
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <MyResult
          climb={climb}
          quals={quals}
          myCompNo={myClimber?.no}
          myMinQual={myMinQual}
        />
      </td>
    </tr>
  )
)
Climb.displayName = 'Climb'

const RelScore = ({
  climb,
  minScore,
  quals,
  myCompNo,
}: {
  climb: store.Climb
  minScore: number
  quals: store.Qual[]
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
  climb: store.Climb
  quals: Qual[]
  myMinQual: number
  myCompNo: number | undefined
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

const Titles = memo(
  ({
    competition,
    myClimber,
    refCategories,
  }: {
    competition: store.Competition
    myClimber?: store.Competitor
    refCategories: string[]
  }) => (
    <div className="min-w-0 flex-1">
      <h2 className="mt-0 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Comp: <Link href="/">{competition.name}</Link>
      </h2>
      <h3>
        Climber:{' '}
        <Link href={`/${competition.id}/climbers`}>
          {myClimber ? (
            `${myClimber.name}, ${myClimber.category} ${myClimber.no}`
          ) : (
            <i>click to select</i>
          )}
        </Link>
        , ref categories: {refCategories.join(', ')}
      </h3>
    </div>
  )
)
Titles.displayName = 'Titles'

export default function Competition({
  competition,
  quals,
  myClimber,
  refCategories,
  climbs,
}: {
  competition: store.Competition
  quals: Qual[]
  myClimber?: store.Competitor
  refCategories: string[]
  climbs: store.Climb[]
}): JSX.Element {
  const myCompNo = myClimber ? myClimber.no : 0

  const myTopQuals = useMemo(
    () =>
      quals
        .filter((q) => q.competitorNo === myCompNo)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8),
    [quals, myCompNo]
  )
  const myMinQual =
    myTopQuals.length > 0 ? Math.min(...myTopQuals.map((q) => q.score)) : 0

  const [climbNo, setClimbNo] = useState<number | undefined>()
  const searchClimb: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newClimbNo = parseInt(e.target.value)
    setClimbNo(newClimbNo > 0 ? newClimbNo : undefined)

    const el = document.getElementById(`climbno-${newClimbNo}`)
    console.log('el is', el)
    el?.scrollIntoView({ block: 'center', inline: 'nearest' })
  }

  return (
    <div className="lg:ml-72 xl:ml-80">
      <style>{`#climbno-${climbNo} { background: #ffe033; }`}</style>
      <Header>
        <ReloadPageButton />
        <input
          type="number"
          name="climbno"
          id="climbno"
          className="rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="climb no"
          onChange={searchClimb}
        />
      </Header>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-8">
          <article className="prose">
            <Titles
              competition={competition}
              myClimber={myClimber}
              refCategories={refCategories}
            />

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
                  <Climb
                    key={climb.climbNo}
                    climb={climb}
                    quals={quals}
                    myClimber={myClimber}
                    myMinQual={myMinQual}
                  />
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
