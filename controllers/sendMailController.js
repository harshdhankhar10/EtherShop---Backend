import SendMail from "../models/sendMailModel.js"
import User from "../models/userModel.js"
import nodemailer from "nodemailer"
import NewsletterMail from "../models/NewsletterMailModel.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from 'bcrypt';

dotenv.config()

import { sendMail } from "../utils/mailHelper.js"



export const sendMailForUsers = async (req,res) => {
    try {
        const {name, email, message} = req.body
        const sendMail = await SendMail.create({name, email, message})
        res.status(200).json({success : true, message : "Mail sent successfully", data : sendMail})
        const transporter = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            }
        })
        const mailOptions = {
            from : process.env.EMAIL_USER,
            to : email,
            subject : "Test Mail",
            text : message
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log(error)
            } else {
                console.log("Email sent : " + info.response)
            }
        })
    } catch (error) {
        res.status(500).json({success : false, message : "Mail sent failed", error : error.message})
    }
}



export const getAllMails = async (req,res) => {
    try {
        const mails = await SendMail.find()
        res.status(200).json({success : true, message : "Mails fetched successfully", data : mails})
    } catch (error) {
        res.status(500).json({success : false, message : "Mails fetched failed", error : error.message})
    }
}



export const getMailById = async (req,res) => {
    try {
        const mail = await SendMail.findById(req.params.id)
        res.status(200).json({success : true, message : "Mail fetched successfully", data : mail})
    } catch (error) {
        res.status(500).json({success : false, message : "Mail fetched failed", error : error.message})
    }
}



export const newUserMail = async (req, res) => {
    try {
        const { name, email } = req.body;
        const sendMail = await SendMail.create({ name, email });
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to EtherShop!",
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EtherShop</title>
</head>
<body style="font-family: 'Arial', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="background-color: #4a90e2; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to EtherShop!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <h2 style="color: #333333; margin-top: 0;">Hello ${name},</h2>
                <p style="color: #666666;">We're thrilled to have you on board! Your account has been successfully created.</p>
                <p style="color: #666666;">Here are some things you can do now:</p>
                <ul style="color: #666666; padding-left: 20px;">
                    <li>Explore our wide range of products</li>
                    <li>Set up your profile</li>
                    <li>Add items to your wishlist</li>
                </ul>
                <a href="https://ethershop.com/get-started" style="display: inline-block; background-color: #4a90e2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 20px; font-weight: bold;">Get Started</a>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                <p style="margin: 0; color: #888888; font-size: 12px;">© 2024 EtherShop. All rights reserved.</p>
                <p style="margin: 10px 0 0; color: #888888; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
            </td>
        </tr>
    </table>
</body>
</html>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ success: false, message: "Mail sent failed", error: error.message });
            } else {
                console.log("Email sent:", info.response);
                res.status(200).json({ success: true, message: "Mail sent successfully", data: sendMail });
            }
        });

    } catch (error) {
        console.error("Error in newUserMail:", error);
        res.status(500).json({ success: false, message: "Mail sent failed", error: error.message });
    }
};


export const mailForDeleteAccount = async (req, res) => {
    try {
        const { email, name } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your EtherShop Account Has Been Deleted",
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deleted - EtherShop</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f6f9fc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <tr>
            <td style="background: linear-gradient(135deg, #6e8efb, #a777e3); padding: 40px; text-align: center;">
                <img src="https://i.postimg.cc/Wz01THQQ/pixelcut-export.jpg" alt="EtherShop Logo" style="width: 120px; height: auto;">
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #333333; margin-top: 0; margin-bottom: 20px; font-size: 24px;">Account Deleted</h2>
                <p style="color: #555555; font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
                <p style="color: #555555; font-size: 16px; margin-bottom: 20px;">We're sorry to see you go. Your EtherShop account has been successfully deleted as per your request.</p>
                <p style="color: #555555; font-size: 16px; margin-bottom: 20px;">If you didn't request this action or have changed your mind, please contact our support team immediately.</p>
                <a href="https://ethershop.com/contact" style="display: inline-block; background-color: #6e8efb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 20px; transition: background-color 0.3s ease;">Contact Support</a>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
                <p style="margin: 0; color: #8795a1; font-size: 14px;">© 2024 EtherShop. All rights reserved.</p>
                <p style="margin: 10px 0 0; color: #8795a1; font-size: 14px;">If you have any questions, please visit our <a href="https://ethershop.com/faq" style="color: #6e8efb; text-decoration: none;">FAQ page</a>.</p>
            </td>
        </tr>
    </table>
</body>
</html>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending delete account email:", error);
                res.status(500).json({ success: false, message: "Failed to send account deletion email", error: error.message });
            } else {
                console.log("Delete account email sent:", info.response);
                res.status(200).json({ success: true, message: "Account deletion email sent successfully" });
            }
        });

    } catch (error) {
        console.error("Error in mailForDeleteAccount:", error);
        res.status(500).json({ success: false, message: "Failed to process account deletion email", error: error.message });
    }
};


export const sendMailToAllUsers = async (req, res) => {
    try {
        const { subject, message } = req.body;

        const users = await User.find();
        const emails = users.map(user => user.email);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails.join(", "),
            subject,
            html: message,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending  email:", error);
                res.status(500).json({ success: false, message: "Failed to send  email", error: error.message });
            } else {
                console.log("Email sent:", info.response);
                res.status(200).json({ success: true, message: "Email sent successfully" });
            }
        });

    } catch (error) {
        console.error("Error in Sending Email:", error);
        res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
    }
};


export const newsLetterMail = async (req, res) => {
    try {
        const { email } = req.body;
        const sendMail = await NewsletterMail.create({ email });
        res.status(200).json({ success: true, message: "Mail sent successfully", data: sendMail });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Our Newsletter!",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Our Newsletter</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: #4CAF50;
                            color: white;
                            text-align: center;
                            padding: 20px;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            background-color: #f9f9f9;
                            padding: 20px;
                            border-radius: 0 0 5px 5px;
                        }
                        .button {
                            display: inline-block;
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 20px;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Welcome to Our Newsletter!</h1>
                    </div>
                    <div class="content">
                        <p>Dear Subscriber,</p>
                        <p>Thank you for joining our newsletter community! We're thrilled to have you on board.</p>
                        <p>Here's what you can expect:</p>
                        <ul>
                            <li>Weekly updates on the latest trends</li>
                            <li>Exclusive content and offers</li>
                            <li>Tips and tricks from industry experts</li>
                        </ul>
                        <p>Stay tuned for our next edition, coming straight to your inbox!</p>
                        <a href="#" class="button">Explore Our Website</a>
                    </div>
                    <div class="footer">
                        <p>© 2024 EtherShop . All rights reserved.</p>
                        <p>If you wish to unsubscribe, <a href="#">click here</a>.</p>
                    </div>
                </body>
                </html>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Mail sent failed", error: error.message });
    }
};




// Mail for Password Reset Request
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).send('User not found');
    }
  
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
  
    await user.save();
  
  
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request - EtherShop',
       html : `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 5px; overflow: hidden;">
        <tr>
            <td style="padding: 30px;">
                <h1 style="color: #0056b3; margin-bottom: 20px; text-align: center;">Password Reset Request</h1>
                
                <p style="margin-bottom: 20px;">You are receiving this email because you have requested to reset the password for your account.</p>
                
                <div style="background-color: #fff3cd; border-left: 5px solid #ffeeba; padding: 15px; margin-bottom: 20px;">
                    <h2 style="color: #856404; margin-top: 0;">Important Information:</h2>
                    <ul style="padding-left: 20px; margin-bottom: 0;">
                        <li style="margin-bottom: 10px;">This reset link is valid for <strong>one-time use only</strong>.</li>
                        <li>The link will <strong>expire in 1 hour</strong>.</li>
                    </ul>
                </div>
                
                <p style="margin-bottom: 30px;">To reset your password, please click on the button below:</p>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                            <a href="${process.env.FRONTEND_URL}/reset/${token}" style="display: inline-block; background-color: #0056b3; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
                        </td>
                    </tr>
                </table>
                
                <p style="margin-top: 30px;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                
                <p style="background-color: #f1f3f5; padding: 10px; border-radius: 3px; word-break: break-all;">
                    <a href="${process.env.FRONTEND_URL}/reset/${token}" style="color: #0056b3; text-decoration: none;">${process.env.FRONTEND_URL}/reset/${token}</a>
                </p>
                
                <p style="margin-top: 30px;">If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
                
                <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
                
                <p style="color: #6c757d; font-size: 14px; text-align: center;">This is an automated message, please do not reply to this email.</p>
                <p style="color: #6c757d; font-size: 14px; text-align: center;">© 2024 EtherShop. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
    `
    };
    await sendMail(mailOptions);
    res.send('Password reset link has been sent to your email address');
  };
  
//   Mail for Password Reset
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  
    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
  
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
  
    await user.save();
    
    res.send('Password has been reset successfully');
  };
    



export const sendMailForMaintenanceMode = async (req, res) => {
    try {
        const {maintenanceStatus, estimatedDuration, additionalInfo} = req.body;
      const users = await User.find();
      const emails = users.map(user => user.email);
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emails.join(", "),
        subject: "Regarding Maintenance Mode - EtherShop",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>EtherShop Maintenance Notice</title>
        </head>
        <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background-color: #3498db; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">EtherShop Maintenance Notice</h1>
            </div>
            <div style="padding: 30px;">
              <div style="background-color: #e74c3c; color: #ffffff; padding: 10px; text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px; border-radius: 5px;">
                Maintenance Mode: Active
              </div>
              <p style="font-size: 16px;">Dear Valued Customer,</p>
              <p style="font-size: 16px;">We hope this email finds you well. We want to inform you that EtherShop is currently undergoing scheduled maintenance to enhance our services and ensure an improved shopping experience for you.</p>
              <div style="background-color: #f9f9f9; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
                <p style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Maintenance Details:</p>
                <p style="margin: 10px 0 0 0;"><strong>Estimated Duration:</strong> ${estimatedDuration} </p>
                <p style="margin: 10px 0 0 0;"><strong>Services Affected:</strong> Website, Mobile App, API</p>
              </div>
              <div style="background-color: #e8f8f5; border-left: 4px solid #2ecc71; padding: 15px; margin: 20px 0;">
                <p style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">What to Expect:</p>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Temporary service unavailability</li>
                  <li>Enhanced performance post-maintenance</li>
                  <li>New features and improvements</li>
                </ul>
              </div>
               <div style="background-color: #daeded; border-left: 4px solid #2ecc71; padding: 15px; margin: 20px 0;">
                <p style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Additional Info:</p>
                <p style="margin: 0;">${additionalInfo || "No additional information provided."}</p>
              </div>
              <p style="font-size: 16px;">During this time, our website and services will be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your patience as we work to enhance your shopping experience.</p>
              <p style="font-size: 16px;">If you have any urgent questions or concerns, please contact our customer support team at <a href="mailto:support@ethershop.com" style="color: #3498db;">support@ethershop.com</a>.</p>
              <p style="font-size: 16px;">Thank you for your understanding and continued support.</p>
              <p style="font-size: 16px;">Best regards,<br>The EtherShop Team</p>
            </div>
            <div style="background-color: #34495e; padding: 20px; text-align: center; color: #ffffff;">
              <p style="margin: 0; font-size: 14px; color: #fffff;">© 2024 EtherShop. All rights reserved.</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                <a href="#" style="color: #3498db; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #3498db; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #3498db; text-decoration: none;">Terms of Service</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Mail sent to all users" });
    }

     catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Mail sent failed", error: error.message });
    }
  };


//   Orders Related Emails


export const sendOrderConfirmationEmail = async (req, res) => {
    try {
        const { email, name, order } = req.body;
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
        });
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Order Confirmation - EtherShop",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background-color: #3498db; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Order Confirmation</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px;">Dear ${name},</p>
              <p style="font-size: 16px;">Thank you for shopping with EtherShop! Your order has been successfully placed and is now being processed.</p>
              <div style="background-color: #f9f9f9; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
                <p style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Order Details:</p>
                <p style="margin: 10px 0 0 0;"><strong>Order ID:</strong> ${order._id}</p>
                <p style="margin: 10px 0 0 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toDateString()}</p>
                <p style="margin: 10px 0 0 0;"><strong>Order Total:</strong> $${order.totalPrice}</p>
              </div>
              <p style="font-size: 16px;">You will receive a confirmation email once your order has been shipped. If you have any questions or concerns, please contact our customer support team at
               <a href="mailto:support@ethershop.com" style="color: #3498db;"/>

                <p style="font-size: 16px;">Thank you for choosing EtherShop. We appreciate your business and look forward to serving you again soon.</p>
                <p style="font-size: 16px;">Best regards,<br>The EtherShop Team</p>
                </div>
                <div style="background-color: #34495e; padding: 20px; text-align: center; color: #ffffff;">
                  <p style="margin: 0; font-size: 14px; color: #fffff;">© 2024 EtherShop. All rights reserved.</p>
                  <p style="margin: 10px 0 0 0; font-size: 14px;">
                    <a href="#" style="color: #3498db; text-decoration: none;">Unsubscribe</a> | 
                    <a href="#" style="color: #3498db; text-decoration: none;">Privacy Policy</a> | 
                    <a href="#" style="color: #3498db; text-decoration: none;">Terms of Service</a>
                  </p>
                </div>
                </div>
                </body>
                </html>
                `,
            };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Order confirmation email sent" });
    }
    
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Failed to send order confirmation email", error: error.message });
        }

    }


    export const orderPaymentFailedEmail = async (req, res) => {
        try {
            const { email, name, order } = req.body;
      
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
            });
            const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Payment Failed - EtherShop",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Payment Failed</title>
            </head>
            <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background-color: #e74c3c; padding: 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Payment Failed</h1>
                </div>
                <div style="padding: 30px;">
                  <p style="font-size: 16px;">Dear ${name},</p>
                  <p style="font-size: 16px;">We regret to inform you that the payment for your recent order has failed. Your order has not been processed and will not be shipped until payment is successfully completed.</p>
                  <div style="background-color: #f9f9f9; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;">
                    <p style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Order Details:</p>
                    <p style="margin: 10px 0 0 0;"><strong>Order ID:</strong> ${order._id}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toDateString()}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Order Total:</strong> $${order.totalPrice}</p>
                    </div>
                    <p style="font-size: 16px;">To complete your payment and ensure your order is processed, please click on the button below:</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${process.env.FRONTEND_URL}/checkout/${order._id}" style="display: inline-block; background-color: #e74c3c; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">Complete Payment</a>
                        </td>
                      </tr>
                    </table>
                    <p style="font-size: 16px;">If you have any questions or concerns, please contact our customer support team at
                     <a href="mailto:support@ethershop.com" style="color: #e74c3c;"/>
                    <p style="font-size: 16px;">Thank you for choosing EtherShop. We appreciate your business and look forward to serving you again soon.</p>
                    <p style="font-size: 16px;">Best regards,<br>The EtherShop Team</p>
                    </div>
                    <div style="background-color: #34495e; padding: 20px; text-align: center; color: #ffffff;">
                      <p style="margin: 0; font-size: 14px; color: #fffff;">© 2024 EtherShop. All rights reserved.</p>
                      <p style="margin: 10px 0 0 0; font-size: 14px;">
                        <a href="#" style="color: #e74c3c; text-decoration: none;">Unsubscribe</a> | 
                        <a href="#" style="color: #e74c3c; text-decoration: none;">Privacy Policy</a> | 
                        <a href="#" style="color: #e74c3c; text-decoration: none;">Terms of Service</a>
                      </p>
                    </div>
                    </div>
                    </body>
                    </html>
                    `,
                };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ success: true, message: "Payment failed email sent" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Failed to send payment failed email", error: error.message });
        }}



export const orderDeliveryEmail = async (req, res) => {
    try {
        const { email, name, order } = req.body;
      
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
          });
          const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Order Shipped - EtherShop",
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Shipped</title>
          </head>
          <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background-color: #2ecc71; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Order Shipped</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px;">Dear ${name},</p>
                <p style="font-size: 16px;">We are pleased to inform you that your order has been shipped and is on its way to you. You can expect to receive it within the next few business days.</p>
                <div style="background-color: #f9f9f9; border-left: 4px solid #2ecc71; padding: 15px; margin: 20px 0;">
                  <p style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Order Details:</p>
                  <p style="margin: 10px 0 0 0;"><strong>Order ID:</strong> ${order._id}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toDateString()}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Order Total:</strong> $${order.totalPrice}</p>
                    </div>
                    <p style="font-size: 16px;">To track your order and view the delivery status, please click on the button below:</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="display: inline-block; background-color: #2ecc71; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">Track Order</a>
                        </td>
                      </tr>
                    </table>
                    <p style="font-size: 16px;">If you have any questions or concerns, please contact our customer support team at
                     <a href="mailto:support@ethershop.com" style="color: #2ecc71;"/>
                    <p style="font-size: 16px;">Thank you for choosing EtherShop. We appreciate your business and hope you enjoy your purchase.</p>
                    <p style="font-size: 16px;">Best regards,<br>The EtherShop Team</p>
                    </div>
                    <div style="background-color: #34495e; padding: 20px; text-align: center; color: #ffffff;">
                      <p style="margin: 0; font-size: 14px; color: #fffff;">© 2024 EtherShop. All rights reserved.</p>
                      <p style="margin: 10px 0 0 0; font-size: 14px;">
                        <a href="#" style="color: #2ecc71; text-decoration: none;">Unsubscribe</a> | 
                        <a href="#" style="color: #2ecc71; text-decoration: none;">Privacy Policy</a> | 
                        <a href="#" style="color: #2ecc71; text-decoration: none;">Terms of Service</a>
                      </p>
                    </div>
                    </div>
                    </body>
                    </html>
                    `,
                };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ success: true, message: "Order shipped email sent" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Failed to send order shipped email", error: error.message });
        }
    }


export const orderDeliveredEmail = async (req, res) => {
    try {
        const { email, name, order } = req.body;
      
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
          });
          const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Order Delivered - EtherShop",
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Delivered</title>
          </head>
          <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background-color: #2ecc71; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Order Delivered</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px;">Dear ${name},</p>
                <p style="font-size: 16px;">We are pleased to inform you that your order has been successfully delivered. We hope you enjoy your purchase and look forward to serving you again soon.</p>
                <div style="background-color: #f9f9f9; border-left: 4px solid #2ecc71; padding: 15px; margin: 20px 0;">
                  <p style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Order Details:</p>
                  <p style="margin: 10px 0 0 0;"><strong>Order ID:</strong> ${order._id}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toDateString()}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Order Total:</strong> $${order.totalPrice}</p>
                    </div>
                    <p style="font-size: 16px;">If you have any questions or concerns, please contact our customer support team at
                     <a href="mailto:support@ethershop.com" style="color: #2ecc71;"/>
                    <p style="font-size: 16px;">Thank you for choosing EtherShop. We appreciate your business and hope you enjoy your purchase.</p>
                    <p style="font-size: 16px;">Best regards,<br>The EtherShop Team</p>
                    </div>
                    <div style="background-color: #34495e; padding: 20px; text-align: center; color: #ffffff;">
                      <p style="margin: 0; font-size: 14px; color: #fffff;">© 2024 EtherShop. All rights reserved.</p>
                      <p style="margin: 10px 0 0 0; font-size: 14px;">
                        <a href="#" style="color: #2ecc71; text-decoration: none;">Unsubscribe</a> | 
                        <a href="#" style="color: #2ecc71; text-decoration: none;">Privacy Policy</a> | 
                        <a href="#" style="color: #2ecc71; text-decoration: none;">Terms of Service</a>
                      </p>
                    </div>
                    </div>
                    </body>
                    </html>
                    `,
                };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ success: true, message: "Order delivered email sent" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Failed to send order delivered email", error: error.message });
        }
    }

export const orderCancellationEmail = async (req, res) => {
    try {
        const { email, name, order } = req.body;
      
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
          });
          const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Order Cancellation - EtherShop",
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Cancellation</title>
          </head>
          <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background-color: #e74c3c; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Order Cancellation</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px;">Dear ${name},</p>
                <p style="font-size: 16px;">We regret to inform you that your order has been cancelled. The cancellation was initiated by our team due to unforeseen circumstances.</p>
                <div style="background-color: #f9f9f9; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;">
                  <p style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Order Details:</p>
                  <p style="margin: 10px 0 0 0;"><strong>Order ID:</strong> ${order._id}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toDateString()}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Order Total:</strong> $${order.totalPrice}</p>
                    </div>
                    <p style="font-size: 16px;">If you have any questions or concerns, please contact our customer support team at
                     <a href="mailto:support@ethershop.com" style="color: #e74c3c;"/>
                    <p style="font-size: 16px;">We apologize for any inconvenience this may have caused and appreciate your understanding.</p>
                    <p style="font-size: 16px;">Thank you for choosing EtherShop. We hope to serve you again in the future.</p>
                    <p style="font-size: 16px;">Best regards,<br>The EtherShop Team</p>
                    </div>
                    <div style="background-color: #34495e; padding: 20px; text-align: center; color: #ffffff;">
                      <p style="margin: 0; font-size: 14px; color: #fffff;">© 2024 EtherShop. All rights reserved.</p>
                      <p style="margin: 10px 0 0 0; font-size: 14px;">
                        <a href="#" style="color: #e74c3c; text-decoration: none;">Unsubscribe</a> | 
                        <a href="#" style="color: #e74c3c; text-decoration: none;">Privacy Policy</a> | 
                        <a href="#" style="color: #e74c3c; text-decoration: none;">Terms of Service</a>
                      </p>
                    </div>
                    </div>
                    </body>
                    </html>
                    `,
                };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ success: true, message: "Order cancellation email sent" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Failed to send order cancellation email", error: error.message });
        }
    }






