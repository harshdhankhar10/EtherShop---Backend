import express from 'express';
const router = express.Router();

import {getAllCategories, createCategory,updateCategory,getSingleCategory,deleteCategory} from "../controllers/categoryController.js"
import { requireSignIn,isAdmin } from '../middlewares/authMiddleware.js';
router.post("/create",requireSignIn, isAdmin, createCategory)
router.get("/all", getAllCategories)
router.put("/update/:id",requireSignIn,isAdmin,updateCategory)
router.get("/singleCategory/:id", getSingleCategory)
router.delete("/delete/:id",requireSignIn, isAdmin,  deleteCategory)
export default router;