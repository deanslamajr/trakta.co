import express from 'express';

import { add as addSample } from './controllers/samples';

const router = express.Router();

router.post('/sample', addSample);

export default router;
