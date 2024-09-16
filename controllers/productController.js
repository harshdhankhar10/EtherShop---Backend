import slugify from 'slugify';
import Product from '../models/productModel.js';
import Category from "../models/categoryModel.js"
import Order from "../models/orderModel.js"
import dotenv from 'dotenv';
dotenv.config();




export const createProduct = async (req, res) => {
  try {
    const {
      title, subTitle, shortDescription, originalPrice, salesPrice, imageUrl,
      inStock, category, brand, seller_Name, tags, status, isFeatured, description
    } = req.body;

    if (!title || !subTitle || !shortDescription || !originalPrice || !salesPrice ||
      !imageUrl || !inStock || !category || !brand || !seller_Name || !tags || !description) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    let slug = slugify(title);
    let existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProduct = new Product({
      title, subTitle, shortDescription, originalPrice, salesPrice, imageUrl,
      inStock, category, brand, seller_Name, tags, status, isFeatured, description, slug
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Product created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const {
      title, subTitle, shortDescription, originalPrice, salesPrice, imageUrl,
      inStock, category, brand, seller_Name, tags, status, isFeatured, description
    } = req.body;

    if (!title || !subTitle || !shortDescription || !originalPrice || !salesPrice ||
      !imageUrl || !inStock || !category || !brand || !seller_Name || !tags || !description) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    let updatedProduct = {
      title, subTitle, shortDescription, originalPrice, salesPrice, imageUrl,
      inStock, category, brand, seller_Name, tags, status, isFeatured, description
    };

    await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
    res.status(200).json({ success: true, message: "Product updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}



export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getProductOfCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category: category.name });
    res.json({ success: true, data: products, category });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProductDetailsBySlug = async (req,res) =>{
  try {
    const product = await Product.findOne({slug : req.params.slug}).populate("category")
    const relatedProducts = await Product.find({category : product.category._id}).limit(4)
    res.status(200).json({
      success : true,
      message : "Product Fetched Successfully",
      product : product,
      relatedProducts : relatedProducts
    })
  } catch (error) {
      console.log(error);
      res.status(500).json({success : false, message : "Internal server error"})
  }
}


export const deleteProduct = async (req,res) =>{
  try {
    await Product.findByIdAndDelete(req.params.id, {new : true})
    res.status(200).json({success : true, message : "Product Deleted Successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({success : false, message : "Internal server error"})
  }
}


