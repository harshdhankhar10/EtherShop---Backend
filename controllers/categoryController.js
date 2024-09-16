import Category from "../models/categoryModel.js";
import slugify from "slugify";

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ success: true, data: categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, image, description } = req.body;

        // Check if all required fields are provided
        if (!name || !image || !description) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        // Create a new category
        const newCategory = new Category({
            name,
            image,
            description,
            slug: slugify(name),
        });

        await newCategory.save();
        return res.status(201).json({ success: true, message: "Category created successfully", data: newCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const {name,description} = req.body;
        const {id} = req.params
        const category = await Category.findByIdAndUpdate(id,{name,description ,slug : slugify(name)},{new : true})
        if(!category) return res.status(404).json({ success: false, message: "Category not found" });
        return res.status(200).json({ success: true, message: "Category updated successfully", data: category });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
        
    }
}

export const getSingleCategory = async (req,res)=>{
    try {
        const {slug} = req.params
        const category = await Category.findById(slug)
        if(!category) return res.status(404).json({ success: false, message: "Category not found" });
        return res.status(200).json({ success: true, data: category });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
        
    }
}

export const deleteCategory = async (req,res)=>{
    try {
        const {id} = req.params
        const category = await Category.findByIdAndDelete(id)
        if(!category) return res.status(404).json({ success: false, message: "Category not found" });
        return res.status(200).json({ success: true, message: "Category deleted successfully" });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
        
    }
}