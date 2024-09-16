import express from 'express';
import { createOrder, capturePayment,getTotalBalance,getAllUserBalances } from '../controllers/fundsController.js'; 
import {isAdmin, requireSignIn} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/create-order', requireSignIn, createOrder);

router.post('/capture-payment', requireSignIn, capturePayment);

router.get('/my-balance', requireSignIn, getTotalBalance);

router.get('/my-all-balances', requireSignIn, getAllUserBalances);

export default router;
