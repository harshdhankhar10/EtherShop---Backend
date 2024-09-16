import Otp from "../models/otpModel.js"
import nodemailer from "nodemailer"
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config()

export const sendOtp = async (req, res) => {
    const { email } = req.body;
  
    try {
      const otp = crypto.randomInt(100000, 999999).toString();
  
      const otpRecord = new Otp({ email, otp });
      await otpRecord.save();
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP Verification - EtherShop',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your OTP Code</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
            </style>
          </head>
          <body style="font-family: 'Roboto', sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
                  <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Your OTP Code</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
                  <p style="font-size: 16px; margin-bottom: 20px;">You've requested a one-time password (OTP) for verification. Please use the code below:</p>
                  <div style="background-color: #f0f0f0; border-radius: 4px; padding: 20px; text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4a4a4a;">${otp}</span>
                  </div>
                  <p style="font-size: 16px; margin-bottom: 20px; color: #e74c3c; font-weight: bold;">This code will expire in 5 minutes.</p>
                  <p style="font-size: 16px; margin-bottom: 20px;">If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
                  <p style="font-size: 16px;">Best regards,<br>EtherShop</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 30px; background-color: #f8f8f8; text-align: center; font-size: 14px; color: #888888;">
                  <p style="margin: 0;">This is an automated message, please do not reply.</p>
                  <p style="margin: 10px 0 0;">© ${new Date().getFullYear()} EtherShop. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      };
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error sending OTP', error });
    }
  };


  export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
            }
            res.status(200).json({ success: true, message: 'OTP verified successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error verifying OTP', error });
    }
    }

  