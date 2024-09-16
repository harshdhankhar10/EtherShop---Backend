import mongoose from "mongoose";


const maintainanceSchema = new mongoose.Schema({
    status : {
        type: String,
        enum: ["Active","Inactive"],
        default: "Inactive"
    },
},{timestamps:true})

const MaintainanceMode = mongoose.model('MaintainanceMode', maintainanceSchema)


export default MaintainanceMode;

