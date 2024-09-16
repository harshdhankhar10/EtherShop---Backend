import userModel from "../models/userModel.js"


export const getAllusers = async (req, res) =>{
    try {
        const users = await userModel.find();
        
        res.status(200).json({success : true, message : "All users fetched", data : users})
    } catch (error) {
        console.log(error)
        res.status(500).json({success : false, message : "Internal Server error"})
    }
}

export const getCompleteUserProfileUsingID = async (req, res) =>{
    try {
            const user = await userModel.findById(req.params.id);
            if(!user){
                return res.status(404).json({success : false, message : "User not found"})
            }
            res.status(200).json({success : true, message : "User fetched", data : {user}})
        } catch (error) {
            console.log(error)
            res.status(500).json({success : false, message : "Internal Server error"})
        }
}

export const deleteUser = async (req, res) =>{
    try {
        const response = await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({success : true, message : "User deleted", data : response})
    } catch (error) {
        console.log(error)
        res.status(500).json({success : false, message : "Internal Server error"})
    }
}

export const createNewUser = async (req, res) =>{
    try {
        const user = await userModel.create(req.body);
        res.status(200).json({success : true, message : "User created", data : user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success : false, message : "Internal Server error"})
    }
}


export const userStatusChange = async (req, res) =>{
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id);
        if(!user){
            return res.status(404).json({success : false, message : "User not found"})
        }

        user.status = req.body.status;

        await user.save();
        res.status(200).json({success : true, message : "User status updated", data : user})

    } catch (error) {
        console.log(error)
        res.status(500).json({success : false, message : "Internal Server error"})
    }
}
