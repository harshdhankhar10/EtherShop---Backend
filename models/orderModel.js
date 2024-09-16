import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      title: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
  payment: {
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["Created", "Successful", "Failed"],
      default: "Created",
    },
    modeOfPayment: { type: String },
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  estimatedDelivery: {
    type: Date,
    default: () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  shippingMethod: {
    type: String,
    enum: ["Standard", "Express"],
    default: "Standard",
  },
  status: {
    type: String,
    default: "Not processed",
    enum: ["Not processed", "Processing", "Shipped","Out for Delivery",  "Delivered", "Cancelled", "Returned"],
  },
  orderStatusUpdates: [
    {
      status: {
        type: String,
        enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Returned", "Cancelled", "Out for Delivery"],
        default: "Order Placed",
      },
      description: {
        type: String,
      },
      time: {
        type: String,
      },
      address: {
        address: String,
      }
    },
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
