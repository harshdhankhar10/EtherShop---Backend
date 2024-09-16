import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        trim : true,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    answer : {
        type  : String,
        required: true
    },
    phoneNo : {
        type: String,
    },
    address : {
        type: String,
        trim: true,
    },
    isVerified : {
        type: Boolean,
        default: false
    },
    status : {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    totalBalance: {
    type: Number,
    default: 0, 
    },
    totalDeposits:{
        type: Number,
        default: 0
    },

},{timestamps:true})

const User = mongoose.model('User', userSchema)

export default User;