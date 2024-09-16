import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const dbConnect = async ()=>{
    try {
        const dbConnect = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}


export default dbConnect