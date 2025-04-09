import express from 'express';
import { createCheckoutSession } from '../controllers/stripeController.js'; // Assuming you have this module

const router = express.Router();

// Create checkout session route
router.post('/create-checkout-session', createCheckoutSession);

export default router;