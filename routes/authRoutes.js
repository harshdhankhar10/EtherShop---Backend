import express from 'express';
const router = express.Router();

import { register, login, forgotPassword, deleteUserAccount, changePassword, loginUsingEmailAndOTP, sendOTP } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.delete("/delete/:id", requireSignIn, deleteUserAccount);
router.put("/change-password", changePassword);
router.post("/login-otp", loginUsingEmailAndOTP);
router.post("/send-otp", sendOTP);

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true, message: "User Authentication Successful" });
});

router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).json({ ok: true, message: "Admin Authentication Successful" });
});

export default router;
