import { Firestore, collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from './firebase'

const competition = async (id: string) => {
  const path = `competitions/${id}`
  const resref = doc(db, path)
  return (await getDoc(resref)).data()!
}

export { competition }

const competitions = async (ownerID: string) =>
  (await getDocs(collection(db, `competitions`))).docs
    .filter((doc) => doc.data().owner === ownerID)
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    // @ts-ignore
    .map(({ id, name, created }) => ({ id, name, created }))
    .sort((a, b) => b.created - a.created)

const categories = async (comp: string) =>
  (await getDocs(collection(db, `competitions/${comp}/categories`))).docs.map(
    (doc) => doc.id
  )

const climbs = async (comp: string) =>
  (await getDocs(collection(db, `competitions/${comp}/climbs`))).docs
    .map((doc) => doc.data())
    .map(({ climbNo, marking, score }) => ({ climbNo, marking, score }))
    .sort((a, b) => b.score - a.score)

const quals = async (comp: string) =>
  (
    await getDocs(collection(db, `competitions/${comp}/qualificationScores`))
  ).docs.map((doc) => doc.data())

const competitors = async (comp: string) =>
  (await getDocs(collection(db, `competitions/${comp}/competitors`))).docs
    .map((doc) => doc.data())
    .map(({ firstName, competitorNo, category }) => ({
      name: firstName,
      no: competitorNo,
      category,
    }))

export { competitions, categories, climbs, quals, competitors }
