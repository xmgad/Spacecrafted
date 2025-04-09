import express from 'express';
import { createSubscription, getSubscription, updateSubscriptionPlan } from '../controllers/subscriptionController.js';
import { requireAuth } from '../middleware/requireAuth.js'; // Assuming you have authentication middleware

//for payment
import { createCheckoutSession } from '../controllers/stripeController.js';

const router = express.Router();


router.post('/create-checkout-session', requireAuth, createCheckoutSession);

// Route to create a new subscription
router.post('/', requireAuth, createSubscription);


// Update route in routes file, assuming the route file structure you previously provided
router.patch('/updatePlan/:userId', requireAuth, updateSubscriptionPlan);


// Route to get a subscription by user ID
router.get('/:userId', requireAuth, getSubscription);

export default router;