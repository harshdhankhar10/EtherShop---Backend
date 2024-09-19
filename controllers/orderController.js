import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
  const currency = "INR";
  const { products, shippingAddress, shippingMethod, amount } = req.body;

  try {
    const options = { amount: amount * 100, currency };
    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = new Order({
      user: req.user.id,
      products,
      payment: {
        orderId: razorpayOrder.id,
        paymentId: null,
        signature: null,
        amount,
        currency,
        status: "Created",
      },
      shippingAddress,
      shippingMethod,
      buyer: req.user.id,
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: "Order created successfully", order: newOrder, orderId: razorpayOrder.id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed", error });
  }
};

// Verify Payment and Update Order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Validate request parameters
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    // Generate signature for verification
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // Verify payment signature
    if (generatedSignature === razorpaySignature) {

      const paymentDetails = await razorpayInstance.payments.fetch(razorpayPaymentId);
      const modeOfPayment = paymentDetails.method;
      
      const paymentId = paymentDetails.id;
      // Check if order exists
      const order = await Order.findOne({ 'payment.orderId': razorpayOrderId });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.payment.status = 'Successful';
      order.status = 'Processing';
      order.payment.modeOfPayment = modeOfPayment;
      order.payment.paymentId = paymentId;
      order.payment.signature = razorpaySignature;
      await order.save();

      res.status(200).json({ success: true, message: 'Payment verified successfully', order });
    } else {
      order.payment.status = 'Failed';
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during payment verification' });
  }
};

// Get Orders by User
export const getUserOrders = async (req, res) => {
  const user = req.user.id;
  try {
    const orders = await Order.find({ user });
    res.status(200).json({ success: true, message: "User orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user orders", error });
  }
};

// Get Specific User All Orders History
export const getUserAllOrders = async (req, res) => {
  try {
    const user = req.user.id;
    const orders = await Order.find({ buyer: user });
    res.status(200).json({ success: true, message: "User orders history fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user orders history", error });
  }
};

// Get Specific User Order Details
export const getUserOrderDetails = async (req, res) => {
  try {
    const user = req.user.id;
    const order = await Order.findById(req.params.id);
    if (order && order.buyer.equals(user)) {
      res.status(200).json({ success: true, message: "User order details fetched successfully", order });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user order details", error });
  }
};

// Get Specific User Order Status Updates
export const getUserOrderStatusUpdates = async (req, res) => {
  try {
    const user = req.user.id;
    const order = await Order.findById(req.params.id);
    if (order && order.buyer.equals(user)) {
      res.status(200).json({ success: true, message: "User order status updates fetched successfully", orderStatusUpdates: order.orderStatusUpdates });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user order status updates", error });
  }
};

// Track Product Details Using Order ID
export const trackOrderUsingOrderID = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }
    const order = await Order.findOne({ "payment.orderId": orderId });
    res.status(200).json({ success: true, message: "Order fetched successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching order", error });
  }
};

// cancel the order

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if(order.status === "Delivered") {
      return res.status(400).json({ success: false, message: "Cannot cancel order that is already delivered" });
    }else if(order.status === "Cancelled") {
      
      return res.status(400).json({ success: false, message: "Order is already cancelled" });
    }
    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error cancelling order", error });
  }
}

// get logged in user orders analytics

export const userOrdersAnalytics = async (req, res) => {
  try {
    const user = req.user.id;
    const orders = await Order.find({ buyer: user });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.payment.amount, 0);
    const totalDelivered = orders.filter(order => order.status === "Delivered").length;
    const totalCancelled = orders.filter(order => order.status === "Cancelled").length;
    const totalProcessing = orders.filter(order => order.status === "Processing").length;
    const totalReturned = orders.filter(order => order.status === "Returned").length;
    res.status(200).json({ success: true, message: "User orders analytics fetched Sucessfully", totalOrders, totalRevenue, totalDelivered, totalCancelled, totalProcessing, totalReturned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user orders analytics", error });
  }
}

// get logged in user recent orders fetch limit 3

export const userRecentOrders = async (req, res) => {
  try {
    const user = req.user.id;
    const orders = await Order.find({ buyer: user }).sort({ createdAt: -1 }).limit(3);
    res.status(200).json({ success: true, message: "User recent orders fetched Sucessfully", orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user recent orders", error });
  }
}














// ADMIN CONTROLLERS

// Get All Orders for Admin
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({ success: true, message: "All orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all orders", error });
  }
};

//  get order details using order id
export const getOrderDetailsUsingID = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);
    // fetch user details for the order
    const user = await User.findById(order.buyer);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, message: "Order fetched successfully", order, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching order", error });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  const {orderId, status, description, time, address } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order.orderStatusUpdates) {
      order.orderStatusUpdates = []; 
    }
    order.orderStatusUpdates.push({ status, description, time, address });
    order.status = status;
    await order.save();
    res.status(200).json({ success: true, message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating order status", error });
  }
};


// complete end to end orders analytics

export const ordersAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.payment.amount, 0);
    const totalDelivered = orders.filter(order => order.status === "Delivered").length;
    const totalCancelled = orders.filter(order => order.status === "Cancelled").length;
    const totalProcessing = orders.filter(order => order.status === "Processing").length;
    const totalReturned = orders.filter(order => order.status === "Returned").length;
    res.status(200).json({ success: true, message: "Order analytics fetched Sucessfully", totalOrders, totalRevenue, totalDelivered, totalCancelled, totalProcessing, totalReturned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching orders analytics", error });
  }
}


// get total sales, total orders, total users, total products, total categories, total revenue

export const getTotalAnalytics = async (req, res) => {

  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { 'payment.status': 'Successful' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);
    res.status(200).json({ success: true, message: "Total analytics fetched successfully", totalOrders, totalUsers, totalProducts, totalCategories, totalRevenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching total analytics", error });
  }
}

export const topSellingProducts = async (req, res) => {
  try {
    const orders = await Order.find({});
    const products = await Product.find({});
    const topProducts = [];
    products.forEach(product => {
      const totalSales = orders.reduce((acc, order) => {
        const productIds = order.products.map(product => product.productId);
        if (productIds.includes(product._id.toString())) {
          return acc + 1;
        }
        return acc;
      }, 0);
      topProducts.push({ product, totalSales });
    });
    topProducts.sort((a, b) => b.totalSales - a.totalSales);
    res.status(200).json({ success: true, message: "Top selling products fetched successfully", topProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching top selling products", error });
  }
}
