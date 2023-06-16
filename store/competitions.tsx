import { z } from 'zod'
import { Timestamp, getDoc, orderBy, query } from 'firebase/firestore'
import { doc, collection, getDocs } from './firebase'

const timestampSchema = z
  .object({
    seconds: z.number(),
    nanoseconds: z.number(),
  })
  .transform((ts) => new Timestamp(ts.seconds, ts.nanoseconds).toDate())

const competitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  owner: z.string(),
  live: z.boolean().default(false),
  scoreEntryEnabled: z.boolean(),
  scoreBoardEnabled: z.boolean(),
  created: timestampSchema,
})

export type Competition = z.infer<typeof competitionSchema>

export type Competitor = {
  name: string
  no: number
  category: string
}

export type Climb = {
  climbNo: number
  marking: string
  score: number
}

const competition = async (id: string): Promise<Competition> => {
  const path = `competitions/${id}`
  const resref = doc(path)
  const data = (await getDoc(resref)).data()!
  return competitionSchema.parse({ id, ...data })
}

const competitions = async (ownerID: string): Promise<Competition[]> => {
  return (
    (await getDocs('competitions', { orderBy: ['created', 'desc'] }))
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      // @ts-ignore
      .filter((doc) => doc.owner === ownerID)
      .map((doc) => competitionSchema.parse(doc))
  )
}

const categories = async (comp: string) =>
  (await getDocs(`competitions/${comp}/categories`)).map((doc) => doc.id)

const climbs = async (comp: string): Promise<Climb[]> =>
  (await getDocs(`competitions/${comp}/climbs`))
    .map((doc) => doc.data())
    .map(({ climbNo, marking, score }) => ({ climbNo, marking, score }))
    .sort((a, b) => b.score - a.score)

const quals = async (comp: string) =>
  (await getDocs(`competitions/${comp}/qualificationScores`)).map((doc) =>
    doc.data()
  )

const competitors = async (comp: string): Promise<Competitor[]> =>
  (await getDocs(`competitions/${comp}/competitors`))
    .map((doc) => doc.data())
    .map(({ firstName, competitorNo, category }) => ({
      name: firstName,
      no: competitorNo,
      category,
    }))

export { competition, competitions, categories, climbs, quals, competitors }
