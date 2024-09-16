import express from "express"
const router = express.Router()

import {isAdmin, requireSignIn} from "../middlewares/authMiddleware.js"
import { 
    createSupportTicket,
    getSupportTickets,
    getAllSupportTickets,
    getSupportTicketById,
    addResponse,
    deleteSupportTicket,
    changeTicketStatus,
    withdrawSupportTicket
 } from "../controllers/supportTicketController.js"

 router.post("/create-ticket", requireSignIn, createSupportTicket)
 router.get("/get-tickets", requireSignIn, getSupportTickets)
 router.get("/tickets", requireSignIn, isAdmin, getAllSupportTickets)
 router.get("/get-ticket/:id", requireSignIn, getSupportTicketById)
 router.post("/add-response/:id", requireSignIn, isAdmin, addResponse)
 router.put("/withdraw-ticket/:id", requireSignIn, withdrawSupportTicket)
 router.delete("/delete-ticket/:id", requireSignIn, isAdmin, deleteSupportTicket)
 router.put("/change-status/:id", requireSignIn, isAdmin, changeTicketStatus)


export default router