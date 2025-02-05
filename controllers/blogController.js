import Blog from "../models/blogModel.js"
import slugify from "slugify"


export const createBlog = async (req,res) =>{

    try {
        const {title,imageURL, subtitle, category, minutesRead, content,authorName,tags,metaTitle,isFeatured,metaDescription,metaKeywords} = req.body
        const slug = slugify(title, {lower:true})
        const newBlog = new Blog({
            user : req.user.id,
            title,
            imageURL,
            subtitle,
            category,
            minutesRead,
            content,
            authorName,
            tags,
            metaTitle,
            metaDescription,
            metaKeywords,
            isFeatured,
            slug
        })
        await newBlog.save()

        res.status(201).json({success:true,message: "Blog Created Successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error", error})
    }
}

export const getAllBlogs = async (req,res) =>{
    try {
        const blogs = await Blog.find({})
        res.status(200).json({success:true,blogs})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error"})
    }
}

export const getBlogForLoggedInUser = async (req,res) =>{
    try {
        const blogs = await Blog.find({user: req.user.id})
        res.status(200).json({success:true,blogs})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error"})
    }

}

export const getBlogById = async (req,res) =>{
    try {
        const blog = await Blog.findById(req.params.id)
        res.status(200).json({success:true,blog})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error"})
    }
}

export const updateBlog = async (req,res) =>{
    try {
        const {title,imageURL, subtitle, category, minutesRead, content,authorName,tags,metaTitle,metaDescription,metaKeywords, isFeatured} = req.body
        const slug = slugify(title, {lower:true})
        const updatedBlog = {
            title,
            imageURL,
            subtitle,
            category,
            minutesRead,
            content,
            authorName,
            tags,
            metaTitle,
            metaDescription,
            metaKeywords,
            isFeatured,
            slug
        }
        await Blog.findByIdAndUpdate(req.params.id,updatedBlog,{new:true})
        res.status(200).json({success:true, message: "Blog Updated Successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error", error})
    }
}


export const getAllCategories = async (req,res) =>{
    try {
        const categories = await Blog.distinct("category")
        res.status(200).json({success:true,categories})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error"})
    }
}



export const getBlogsBasedOnCategory = async (req,res) =>{
    try {
        const blogs = await Blog.find({category: req.params.category})
        res.status(200).json({success:true,blogs})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error", error})
    }
}


export const deleteBlog = async (req,res) =>{
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        res.status(200).json({success:true, message: "Blog Deleted Successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error", error})
    }
}

export const getRealtedBlog = async (req,res) =>{
    try {
        const blog = await Blog.findById(req.params.id)
        const relatedBlogs = await Blog.find({category: blog.category, _id: {$ne: blog._id}})
        res.status(200).json({success:true,relatedBlogs})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success :false,message: "Internal Server Error", error})
    }
}