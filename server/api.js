import express from 'express';
import bodyParser from 'body-parser';

import { create as createSample } from './controllers/sample';
import { getAll as getAllSampleInstances } from './controllers/sample-instances';


const router = express.Router();

/**
 * Client posts mp3 stream here
 */
router.post('/sample', createSample);

/**
 * Prototype: give me all the samples
 */
router.get('/sampleInstances', getAllSampleInstances);

export default router;