const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemType: { type: String, enum: ['base', 'sauce', 'cheese', 'vegetable'], required: true },
  name: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 20 }
});

module.exports = mongoose.model('Inventory', inventorySchema);
