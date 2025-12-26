import express from 'express';
import { signup, login, getMe, forgotPassword, verifyOTP } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);

export default router;
