// User related routes
import { registerUser, loginUser, sendOTP, resetPassword, fetchMyUser, fetchMyUserField } from '../controllers/userController.js';

import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router()

// signup route
router.post('/register', registerUser)
// login route
router.post('/login', loginUser);
//send otp route
router.post('/send-otp', sendOTP);
//reset password route
router.post('/reset-password', resetPassword);
//fetch my user
router.get('/me', requireAuth, fetchMyUser);
// fetch field from my user
router.get('/me/:field', requireAuth, fetchMyUserField);

export default router;