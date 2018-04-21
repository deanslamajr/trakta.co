import express from 'express'

import { getByTrakName as getTraksSampleInstances } from './controllers/sample-instances'
import {
  getAll as getAllTraks,
  recordPlay,
  saveTrak
} from './controllers/traks'

import { create as createSampleAndAddInstanceToTrak } from './controllers/samples'

// import { getNextWindowEndTime } from './controllers/getNextWindowEndTime'

const router = express.Router()

/**
 * Fetch all the sample instances
 * @todo target a particular track's sample instances
 */
router.post('/play-back', recordPlay)

/**
 * Fetch all the sample instances
 * @todo target a particular track's sample instances
 */
router.get('/sample-instances/:trakName', getTraksSampleInstances)

/**
 * Add sample to existing track
 * @todo add trak update logic
 */
router.post('/sample', createSampleAndAddInstanceToTrak)

/**
 * Fetch all the traks
 * @todo do a top 100 fetch/ filtered fetch
 */
router.get('/traks', getAllTraks)

/**
 * Save a new version of a trak
 */
router.post('/trak/:trakName', saveTrak)

/**
 * Generate the user's next window-end-time
 */
// router.get('/next', getNextWindowEndTime);

export default router
