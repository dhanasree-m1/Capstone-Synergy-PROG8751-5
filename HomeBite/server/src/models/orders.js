const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  customer_id: { type: Number, ref: 'User', required: true },
  chef_id: { type: Number, ref: 'Chef', required: true },
  rider_id: { type: Number, ref: 'User' },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'], required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
