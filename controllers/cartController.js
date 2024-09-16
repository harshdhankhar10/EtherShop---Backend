import Cart from "../models/cartModel.js"


export const addToCart = async (req,res) => {
    try {
        const {name, unitPrice, quantity, image, finalPrice} = req.body
        const cartItem = await Cart.create({name, unitPrice, quantity, image, finalPrice})
        res.status(200).json({success : true, message : "Cart Item added successfully", data : cartItem})
    } catch (error) {
        res.status(500).json({success : false, message : "Cart Item added failed", error : error.message})
    }
}


export const getAllCartItems = async (req,res) => {
    try {
        const cartItems = await Cart.find()
        res.status(200).json({success : true, message : "Cart Items fetched successfully", data : cartItems})
    } catch (error) {
        res.status(500).json({success : false, message : "Cart Items fetched failed", error : error.message})
    }
}


