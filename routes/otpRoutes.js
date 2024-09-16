import express from 'express';
const router = express.Router();

import { sendOtp, verifyOtp } from '../controllers/otpController.js';


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);



export default router;