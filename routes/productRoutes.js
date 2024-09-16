import express from "express";
const router = express.Router();

import {createProduct, getAllProducts, updateProduct,getProductOfCategory, getProductDetailsBySlug, deleteProduct
} from "../controllers/productController.js";

import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import {searchProduct} from "../controllers/searchProductController.js"
router.post("/create", requireSignIn, isAdmin, createProduct);

router.get("/all", getAllProducts);

router.get("/category/:slug",getProductOfCategory)

router.get("/product/:slug", getProductDetailsBySlug)

router.get("/search", searchProduct)

// router.get("/all/:id", getProductById);

router.put("/update/:id", requireSignIn, isAdmin, updateProduct);

router.delete("/delete/:id", requireSignIn, isAdmin, deleteProduct);




export default router;