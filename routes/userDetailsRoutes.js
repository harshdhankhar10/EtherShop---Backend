import express from "express"
const router = express.Router()

import {
    getAllusers, 
    getCompleteUserProfileUsingID,
    deleteUser,
    createNewUser,
    userStatusChange,
    getUserOverview
} from "../controllers/userController.js"
import {requireSignIn, isAdmin} from "../middlewares/authMiddleware.js"


router.get("/all-users", requireSignIn, isAdmin, getAllusers)
router.get("/user-profile/:id", requireSignIn,isAdmin, getCompleteUserProfileUsingID)

router.delete("/delete-user/:id", requireSignIn, isAdmin, deleteUser)

router.post("/create-new-user", requireSignIn, isAdmin, createNewUser)

router.put("/change-user-status/:id", requireSignIn, isAdmin, userStatusChange)

router.get("/user-overview", requireSignIn, isAdmin, getUserOverview)


export default router;