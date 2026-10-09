const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pizza: {
    base: String,
    sauce: String,
    cheese: String,
    vegetables: [String]
  },
  price: { type: Number, required: true },
  paymentId: String, // Razorpay payment id, set after checkout confirms
  status: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'],
    default: 'Order Received'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
