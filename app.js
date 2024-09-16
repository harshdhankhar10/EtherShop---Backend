import express from 'express';
import  colors from 'colors';
import morgan from 'morgan';
const app = express();
import dotenv from 'dotenv'
dotenv.config()
import dbConnect from "./config/db.js"
import "./jobs/cronJobs.js"
dbConnect()

// Routes
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import contactFormRoutes from "./routes/contactFormRoutes.js"
import supportTicketRoutes from './routes/supportTicketRoutes.js';
import myProfileRoutes from './routes/MyProfileRoutes.js';
import userDetails from "./routes/userDetailsRoutes.js"
import couponRoutes from "./routes/couponRoutes.js"
import blogRoutes from "./routes/blogRoutes.js"
import otpRoutes from "./routes/otpRoutes.js"
import sendMailRoutes from "./routes/sendMailRoutes.js"
import MaintainanceModeRoutes from "./routes/maintainanceModeRoutes.js"
import OrderRoutes  from "./routes/orderRoutes.js"
import FundRoutes from "./routes/fundsRoutes.js"


import cors from "cors"
app.use(express.json())
app.use(cors())

// routes

app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/category', categoryRoutes)

app.use('/api/v1/product', productRoutes)

app.use('/api/v1/contactForm', contactFormRoutes)

app.use('/api/v1/support-tickets', supportTicketRoutes)

app.use('/api/v1/profile', myProfileRoutes)

app.use("/api/v1/users", userDetails)

app.use('/api/v1/coupon', couponRoutes)

app.use('/api/v1/blog', blogRoutes)

app.use('/api/v1/otp', otpRoutes)

app.use('/api/v1/mail', sendMailRoutes)

app.use('/api/v1/maintainance', MaintainanceModeRoutes)

app.use('/api/v1/orders', OrderRoutes)

app.use('/api/v1/funds', FundRoutes)



app.get('/', (req, res) => {
    res.send('Hello, World!')
})


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000'.bgCyan.white);
})