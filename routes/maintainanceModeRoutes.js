import express from 'express'
const router = express.Router()


import {getMaintainanceStatus, setMaintainanceStatus} from "../controllers/maintainanceController.js"
import {isAdmin, requireSignIn} from "../middlewares/authMiddleware.js"

router.get("/status",getMaintainanceStatus)
router.put("/setMaintainanceMode",requireSignIn,isAdmin,setMaintainanceStatus)



export default router;