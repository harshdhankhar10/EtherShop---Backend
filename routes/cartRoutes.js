import express from "express"
const router = express.Router()


import {getAllCartItems, addToCart}  from "../controllers/cartController.js"

router.get("/all",getAllCartItems)

router.post("/add",addToCart)



export default router;