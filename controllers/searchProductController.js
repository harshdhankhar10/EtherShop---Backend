import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
export const searchProduct = async (req, res) => {
    const { keyword = "" } = req.query;

    try {
        const products = await Product.find({
            title: { $regex: keyword, $options: "i" }
        });

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
