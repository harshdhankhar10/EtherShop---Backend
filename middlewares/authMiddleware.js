import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from "../models/userModel.js";

dotenv.config();

export const requireSignIn = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({
          success: false,
          message: 'No token provided',
        });
      }
  
      const token = authHeader; // Directly use the token from the header
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Set the decoded token payload to req.user
      next();
    } catch (error) {
      console.log('Token verification error:', error);
      return res.status(401).send({
        success: false,
        message: 'Unauthorized',
      });
    }
  };
  

  
  export const isAdmin = async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.id);
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      if (user.role !== "admin") {
        return res.status(403).send({
          success: false,
          message: "Forbidden: Admin access required",
        });
      }
  
      next();
    } catch (error) {
      console.log('Error in isAdmin middleware:', error);
      return res.status(401).send({
        success: false,
        message: "Error in admin middleware",
      });
    }
  };
  