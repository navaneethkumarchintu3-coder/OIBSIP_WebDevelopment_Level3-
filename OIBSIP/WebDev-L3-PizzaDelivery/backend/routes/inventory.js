const express = require('express');
const Inventory = require('../models/Inventory');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/inventory — public: used to populate pizza-builder dropdown options
router.get('/', async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

// PATCH /api/inventory/:id — admin: manually adjust stock
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { stock } = req.body;
  const item = await Inventory.findByIdAndUpdate(req.params.id, { stock }, { new: true });
  res.json(item);
});

module.exports = router;
