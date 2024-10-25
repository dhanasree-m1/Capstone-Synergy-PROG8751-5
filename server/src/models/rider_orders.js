const mongoose = require('mongoose');

const RiderOrderSchema = new mongoose.Schema({
  rider_order_id: { type: Number, required: true, unique: true },
  order_id: { type: Number, ref: 'Order', required: true },
  rider_id: { type: Number, ref: 'User', required: true },
  pickup_time: { type: Date },
  delivery_time: { type: Date },
  distance: { type: Number },
  earnings: { type: Number }
});

module.exports = mongoose.model('RiderOrder', RiderOrderSchema);
