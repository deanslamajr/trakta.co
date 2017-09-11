import express from 'express';
import bodyParser from 'body-parser';

import { create as createSample } from './controllers/sample';
import { getAll as getAllSampleInstances } from './controllers/sample-instances';
import { getNextWindowEndTime } from './controllers/getNextWindowEndTime'


const router = express.Router();

/**
 * Client posts mp3 stream here
 */
router.post('/sample', createSample);

/**
 * Fetch all the sample instances
 */
router.get('/sampleInstances', getAllSampleInstances);

/**
 * Generate the user's next window-end-time
 */
router.get('/next', getNextWindowEndTime);

export default router;