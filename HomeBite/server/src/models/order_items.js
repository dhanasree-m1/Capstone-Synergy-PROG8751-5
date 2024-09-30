const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  order_item_id: { type: Number, required: true, unique: true },
  order_id: { type: Number, ref: 'Order', required: true },
  product_id: { type: Number, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  special_request: { type: String },
  unit_price: { type: Number, required: true }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
