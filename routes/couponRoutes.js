import express from "express";
import { createCoupon, getCoupons, gettingCouponStatus, deleteCoupon, updateCoupon } from "../controllers/couponController.js";

import {isAdmin, requireSignIn} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", requireSignIn, isAdmin, createCoupon);
router.get("/get", requireSignIn, isAdmin, getCoupons);
router.post("/status", gettingCouponStatus);
router.delete("/delete/:id", requireSignIn, isAdmin, deleteCoupon);
router.put("/update/:id", requireSignIn, isAdmin, updateCoupon);

export default router;