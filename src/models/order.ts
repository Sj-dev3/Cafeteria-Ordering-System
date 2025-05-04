import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    // Make address optional if pickup is chosen later
    addressLine1: { type: String },
    city: { type: String },
  },
  cartItems: [
    {
      menuItemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  // Add orderType field
  orderType: {
    type: String,
    enum: ["delivery", "pickup"],
    required: true,
  },
  totalAmount: Number,
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
  },
  createdAt: { type: Date, default: Date.now },
});

// Add validation based on orderType if needed (e.g., require address for delivery)
orderSchema.pre('save', function(next) {
  if (this.orderType === 'delivery' && (!this.deliveryDetails?.addressLine1 || !this.deliveryDetails?.city)) {
    next(new Error('Address and city are required for delivery orders.'));
  } else {
    // Clear address fields if pickup is selected (optional)
    // if (this.orderType === 'pickup') {
    //   this.deliveryDetails.addressLine1 = undefined;
    //   this.deliveryDetails.city = undefined;
    // }
    next();
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
