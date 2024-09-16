import express from "express";

const router = express.Router();
import { createOrder, verifyPayment, getUserOrders,
    getUserAllOrders, getUserOrderDetails, getUserOrderStatusUpdates,trackOrderUsingOrderID,
    getAllOrdersForAdmin,updateOrderStatus,cancelOrder, getOrderDetailsUsingID,ordersAnalytics
 } from "../controllers/orderController.js";
import {requireSignIn, isAdmin} from "../middlewares/authMiddleware.js"

// Track Order using Order ID
router.get("/track-order", trackOrderUsingOrderID);

// Create Order
router.post("/create-order", requireSignIn,createOrder);

// Verify Payment
router.post("/verify-payment", requireSignIn, verifyPayment);

// Get Orders for User Dashboard
router.get("/user-orders", requireSignIn, getUserOrders);

// Get All Orders for User
router.get("/user-all-orders", requireSignIn, getUserAllOrders);

// Cancel Order
router.put("/cancel-order/:id", requireSignIn, cancelOrder);

// Get specific Order Details for User
router.get("/user-order-details/:id", requireSignIn, getUserOrderDetails);

// Get Order Status Updates for User
router.get("/user-order-status-updates/:id", requireSignIn, getUserOrderStatusUpdates);



///////////////////////// ADMIN ROUTES //////////////////////////

// Get All Orders for Admin
router.get("/admin-all-orders", requireSignIn,isAdmin, getAllOrdersForAdmin);

// Get Order Details using Order ID
router.get("/order-details/:id", requireSignIn,isAdmin, getOrderDetailsUsingID);

// Update Order Status for Admin
router.put("/update-order-status/:id", requireSignIn,isAdmin, updateOrderStatus);


// Get Orders Analytics
router.get("/orders-analytics", requireSignIn,isAdmin, ordersAnalytics);


export default router;
