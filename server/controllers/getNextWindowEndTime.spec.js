/* eslint-env jest */

import {
  processNext,
  ORIGIN_END_TIME,
  ROUND_PROGRESS_LENGTH } from './getNextWindowEndTime'

describe('::processNext', () => {
  describe('if the current endTime has exceeded the current farthestTime', () => {
    it('should reset the window to the beginning', () => {
      const session = {
        currentEndtime: 10,
        farthestTime: 0
      }

      const endTime = processNext(session)
      expect(ORIGIN_END_TIME).toEqual(endTime)
    })

    it('should update the sessions farthestTime', () => {
      const session = {
        currentEndtime: 10,
        farthestTime: 0
      }

      const expected = session.currentEndtime

      processNext(session)
      expect(expected).toEqual(session.farthestTime)
    })

    it('should reset the sessions farthestTime to the ORIGIN_END_TIME', () => {
      const session = {
        currentEndtime: 10,
        farthestTime: 0
      }

      processNext(session)
      expect(ORIGIN_END_TIME).toEqual(session.farthestTime)
    })
  })

  describe('if the current endTime has NOT exceeded the current farthestTime', () => {
    it('should progress the currentEndTime', () => {
      const session = {
        currentEndtime: 10,
        farthestTime: 15
      }

      const expected = session.currentEndtime + ROUND_PROGRESS_LENGTH

      const endTime = processNext(session)
      expect(expected).toEqual(endTime)
    })

    it('should NOT update the sessions farthestTime', () => {
      const session = {
        currentEndtime: 10,
        farthestTime: 15
      }

      const expected = session.farthestTime

      processNext(session)
      expect(expected).toEqual(session.farthestTime)
    })

    it('should progress the session`s farthestTime', () => {
      const session = {
        currentEndtime: 10,
        farthestTime: 15
      }

      const expected = session.currentEndtime + ROUND_PROGRESS_LENGTH

      processNext(session)
      expect(expected).toEqual(session.currentEndtime)
    })
  })
})
