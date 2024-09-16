import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

let otps = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

const generateOTP = ()=>{
    return Math.floor(100000 + Math.random() * 900000);
}


export const register = async (req, res) => {
    const { fullName, email, password, answer } = req.body;
    try {
        if (!fullName || !email || !password || !answer) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, email, password: hashedPassword, answer });
        await user.save();

        return res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Please fill in all fields' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.status === 'inactive') {
            return res.status(401).json({ success: false, message: 'Your account is inactive, please contact admin' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            success: true,
            message: 'Login Successfully',
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
            token
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email || !answer || !newPassword) return res.status(400).json({ success: false, message: 'All fields are required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        return res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', data: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword) return res.status(400).json({ success: false, message: 'All fields are required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        return res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteUserAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'User account deleted successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};



export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Please provide an email' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = generateOTP();
        otps[email] = otp; 

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Login',
            html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Login OTP</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <tr>
                    <td align="center" bgcolor="#4CAF50" style="padding: 40px 0;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Your Login OTP</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Hello,</p>
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">You've requested to log in using a one-time password (OTP). Here's your OTP:</p>
                        <p style="background-color: #f0f0f0; border-radius: 4px; color: #333333; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0 0 20px; padding: 20px; text-align: center;">${otp}</p>
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">If you didn't request this OTP, please ignore this email or contact our support team if you have any concerns.</p>
                    </td>
                </tr>
                <tr>
                    <td align="center" bgcolor="#f0f0f0" style="padding: 20px 0;">
                        <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0;">&copy; 2024 EtherShop. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
            `
        };
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const loginUsingEmailAndOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: 'All fields are required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (otp != otps[email]) return res.status(401).json({ success: false, message: 'Invalid OTP' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            success: true,
            message: 'Login Successfully',
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
            token
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}