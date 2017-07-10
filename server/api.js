import express from 'express';

import { initialize as initializeGame } from './controllers/game';

const router = express.Router();

router.post('/initialize', initializeGame);

export default router;
