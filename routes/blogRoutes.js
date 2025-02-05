import express from 'express'
const router   = express.Router()


import {createBlog, getAllBlogs, getBlogForLoggedInUser, updateBlog, getBlogById, deleteBlog,getAllCategories,
    getBlogsBasedOnCategory, getRealtedBlog
} from "../controllers/blogController.js"
import {requireSignIn,isAdmin} from "../middlewares/authMiddleware.js"

router.post("/create-blog",requireSignIn,createBlog)
router.get("/all-blogs", getAllBlogs)
router.get("/my-blogs",requireSignIn,getBlogForLoggedInUser)
router.get("/blog/:id",getBlogById)
router.delete("/delete-blog/:id",requireSignIn,deleteBlog)
router.put("/update-blog/:slug",requireSignIn,updateBlog)
router.get("/all-categories",getAllCategories)
router.get("/category/:category",getBlogsBasedOnCategory)
router.get("/related-blogs/:id",getRealtedBlog)

export default router;