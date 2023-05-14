import { Timestamp, getDoc, getDocs } from 'firebase/firestore'
import * as firestore from 'firebase/firestore'

import { doc, collection } from './firebase'

jest.mock('./firebase', () => ({
  doc: (path: string) => `$doc/${path}`,
  collection: (path: string) =>
    firestore.collection({} as firestore.Firestore, path),
}))

jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore')

  return {
    ...original,
    getDoc: jest.fn(),
    getDocs: jest.fn(),
  }
})

import { competition, competitions } from './competitions'

describe('competition', () => {
  describe('when returned data is correct', () => {
    const comp = {
      name: 'Test Boulder Comp',
      owner: 'ownerId',
      live: true,
      scoreEntryEnabled: true,
      scoreBoardEnabled: false,
      created: Timestamp.fromDate(new Date('2021-01-01T11:22:33.444Z')),
    }

    it('returns parsed competition data', async () => {
      const id = 'competitionId'

      ;(getDoc as jest.Mock).mockResolvedValueOnce({
        data: () => comp,
      })

      const result = await competition(id)
      expect(result).toEqual({
        ...comp,
        id,
        created: comp.created.toDate(),
      })
      expect(getDoc).toHaveBeenCalledWith(doc(`competitions/${id}`))
    })
  })
})

describe('competitions', () => {
  describe('when returned data is correct', () => {
    const compGoodOwnerID = 'compGoodOwnerID'
    const compGoodOwner = {
      name: 'Test Boulder Comp',
      owner: 'goodOwner',
      live: true,
      scoreEntryEnabled: true,
      scoreBoardEnabled: false,
      created: Timestamp.fromDate(new Date('2021-01-01T11:22:33.444Z')),
    }
    const compBadOwnerID = 'compBadOwnerID'
    const compBadOwner = {
      name: 'Old Boulders',
      owner: 'badOwner',
      live: false,
      scoreEntryEnabled: false,
      scoreBoardEnabled: false,
      created: Timestamp.fromDate(new Date('2020-01-01T11:22:33.444Z')),
    }

    it.only('returns parsed data for requested owner comps only', async () => {
      ;(getDocs as jest.Mock).mockResolvedValueOnce([
        {
          id: compGoodOwnerID,
          data: () => compGoodOwner,
        },
        {
          id: compBadOwnerID,
          data: () => compBadOwner,
        },
      ])

      const result = await competitions(compGoodOwner.owner)
      expect(result).toEqual([
        {
          ...compGoodOwner,
          id: compGoodOwnerID,
          created: compGoodOwner.created.toDate(),
        },
      ])
      // expect(getDocs).toHaveBeenCalledWith(doc(`competitions/${id}`))
    })
  })
})
