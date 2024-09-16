import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    unitPrice : {
        type:Number,
        required:true
    },
    quantity : {
        type:Number,
        required:true
    },
    image : {
        type:String,
        required:true
    },
    finalPrice : {
        type:Number,
        required:true
    },
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true
})

const Cart = mongoose.model("Cart",cartSchema)

export default Cart