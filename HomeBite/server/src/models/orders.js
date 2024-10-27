import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chef_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  rider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'], default: 'preparing' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);