const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  payment_id: { type: Number, required: true, unique: true },
  order_id: { type: Number, ref: 'Order', required: true },
  payment_method: { type: String, enum: ['credit_card', 'paypal', 'wallet'], required: true },
  transaction_id: { type: String },
  amount: { type: Number, required: true },
  payment_status: { type: String, enum: ['successful', 'failed', 'pending'], required: true },
  payment_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
