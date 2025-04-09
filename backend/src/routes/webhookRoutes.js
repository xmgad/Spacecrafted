import express from 'express';
import { handleEvent } from '../controllers/stripeController.js';

const router = express.Router();


router.post('/', express.raw({ type: 'application/json' }), handleEvent);

export default router;
