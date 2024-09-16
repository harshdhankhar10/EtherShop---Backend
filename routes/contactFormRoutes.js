import express from "express"
const router = express.Router()

import { createContactForm, getContactForm } from "../controllers/contactFormController.js"

import { requireSignIn , isAdmin } from "../middlewares/authMiddleware.js"

router.post('/create',requireSignIn, createContactForm)
router.get('/get', requireSignIn, isAdmin, getContactForm)

export default router