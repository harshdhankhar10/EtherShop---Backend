import express from "express"
const router = express.Router()

import {
    getMyProfile,
    updateMyProfile,
    createProfile
} from "../controllers/MyProfileController.js"

import { requireSignIn } from "../middlewares/authMiddleware.js"

router.get('/my-profile', requireSignIn, getMyProfile)
router.put('/update-profile', requireSignIn, updateMyProfile)
router.post('/create-profile', requireSignIn, createProfile)

export default router;