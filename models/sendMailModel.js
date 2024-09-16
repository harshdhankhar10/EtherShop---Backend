import mongoose from "mongoose"


const sendMailSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    message : {
        type:String,
    }
},{
    timestamps:true
})

const SendMail = mongoose.model("SendMail",sendMailSchema)

export default SendMail