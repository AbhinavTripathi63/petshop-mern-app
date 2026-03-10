const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    itemType: { type: String, enum: ["product", "service"], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    nameSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    customerNote: { type: String, default: "" },
      payment: {
    provider: { type: String, default: "razorpay" },
    orderId: { type: String, default: "" },     // Razorpay order_id
    paymentId: { type: String, default: "" },   // Razorpay payment_id
    signature: { type: String, default: "" },   // signature
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" }
    },
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["created", "whatsapp_opened", "paid", "completed"],
      default: "created"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);