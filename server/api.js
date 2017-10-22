import express from 'express';
import bodyParser from 'body-parser';

import { getByTrakName as getTraksSampleInstances } from './controllers/sample-instances';
import {
  getAll as getAllTraks,
  create as createTrakAndCreateAddSample } from './controllers/traks';

//import { getNextWindowEndTime } from './controllers/getNextWindowEndTime'


const router = express.Router();

/**
 * Fetch all the sample instances
 * @todo target a particular track's sample instances
 */
router.get('/sample-instances/:trakName', getTraksSampleInstances);

/**
 * Add sample to existing track
 * @todo add trak update logic
 */
router.post('/trak', createTrakAndCreateAddSample);

/**
 * Add sample to existing track
 * @todo add trak update logic
 */
//router.put('/trak/:trak/sample', createSample);

/**
 * Fetch all the traks
 * @todo do a top 100 fetch/ filtered fetch
 */
router.get('/traks', getAllTraks);

/**
 * Generate the user's next window-end-time
 */
//router.get('/next', getNextWindowEndTime);

export default router;