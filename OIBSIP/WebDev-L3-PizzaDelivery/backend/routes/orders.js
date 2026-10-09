const express = require('express');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — create an order after Razorpay checkout succeeds
// NOTE: Razorpay integration goes here. In test mode, the frontend calls Razorpay's
// checkout.js, and on a successful test payment, this route is hit with the paymentId.
router.post('/', requireAuth, async (req, res) => {
  try {
    const { pizza, price, paymentId } = req.body;

    // decrement stock for each chosen component
    const componentNames = [pizza.base, pizza.sauce, pizza.cheese, ...pizza.vegetables];
    for (const name of componentNames) {
      await Inventory.findOneAndUpdate(
        { name },
        { $inc: { stock: -1 } }
      );
    }

    const order = await Order.create({
      user: req.user.id,
      pizza,
      price,
      paymentId,
      status: 'Order Received'
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});

// GET /api/orders/mine — user's own orders, for dashboard polling
router.get('/mine', requireAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders — admin: view all orders
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// PATCH /api/orders/:id/status — admin: update order status
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const valid = ['Order Received', 'In Kitchen', 'Sent to Delivery'];
  if (!valid.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});

module.exports = router;
