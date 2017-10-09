import express from 'express';
import bodyParser from 'body-parser';

import { create as createSample } from './controllers/sample';
import { getAll as getAllSampleInstances } from './controllers/sample-instances';
import { getAll as getAllTraks } from './controllers/traks';

//import { getNextWindowEndTime } from './controllers/getNextWindowEndTime'


const router = express.Router();

/**
 * Client posts mp3 stream here
 */
router.post('/sample', createSample);

/**
 * Fetch all the sample instances
 * @todo target a particular track's sample instances
 */
router.get('/sampleInstances', getAllSampleInstances);

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