import express from 'express';
const router = express.Router();

import {sendMailForUsers, newUserMail, getAllMails, mailForDeleteAccount,sendMailToAllUsers,newsLetterMail,requestPasswordReset, resetPassword
    ,sendMailForMaintenanceMode
} from "../controllers/sendMailController.js"
import {requireSignIn,isAdmin} from "../middlewares/authMiddleware.js"

router.post("/sendmail", requireSignIn, isAdmin,sendMailForUsers)
router.post("/newusermail",requireSignIn, isAdmin ,newUserMail)
router.get("/getmails",requireSignIn, isAdmin, getAllMails)
router.post("/deletemail",requireSignIn, mailForDeleteAccount)
router.post("/sendmailtoall",requireSignIn, isAdmin, sendMailToAllUsers)
router.post("/newslettermail",newsLetterMail)
router.post('/request-reset-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.post("/maintenance-mode",requireSignIn,isAdmin,sendMailForMaintenanceMode)



export default router;