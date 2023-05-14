import * as firestore from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { Firestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAdIicor5wq2Bv2c-dxsFQ27VQM_5wmLxY',
  authDomain: 'fingercomps-lite-au.firebaseapp.com',
  databaseURL: 'https://fingercomps-lite-au.firebaseio.com',
  projectId: 'fingercomps-lite-au',
  storageBucket: 'fingercomps-lite-au.appspot.com',
  messagingSenderId: '889827328281',
}

let appDB: Firestore | null = null

const db = () => {
  if (!appDB) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    // Initialize Cloud Firestore and get a reference to the service
    appDB = getFirestore(app)
  }

  return appDB
}

const doc = (path: string) => {
  return firestore.doc(db(), path)
}

const collection = (path: string) => {
  return firestore.collection(db(), path)
}

type GetDocsOptions = {
  orderBy?: [string, 'asc' | 'desc']
}
const getDocs = async (path: string, options?: GetDocsOptions) => {
  const constraints: firestore.QueryConstraint[] = []
  if (options?.orderBy) {
    constraints.push(firestore.orderBy(...options.orderBy))
  }
  const q = firestore.query(collection(path), ...constraints)
  return (await firestore.getDocs(q)).docs
}

export { doc, collection, getDocs }
