const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  rating_id: { type: Number, required: true, unique: true },
  customer_id: { type: Number, ref: 'User', required: true },
  product_id: { type: Number, ref: 'Product', required: true },
  chef_id: { type: Number, ref: 'Chef', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', RatingSchema);
