import mongoose from "mongoose";

const MyProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"], 
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, {timestamps: true});

const MyProfile = mongoose.model('MyProfile', MyProfileSchema);

export default MyProfile;
