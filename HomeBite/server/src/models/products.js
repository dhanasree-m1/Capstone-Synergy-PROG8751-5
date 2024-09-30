const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_id: { type: Number, required: true, unique: true },
  chef_id: { type: Number, ref: 'Chef', required: true },
  name: { type: String, required: true },
  description: { type: String },
  ingredients: { type: String },
  price: { type: Number, required: true },
  preparation_time: { type: Number, required: true },
  availability: { type: String, enum: ['daily', 'weekly'], required: true },
  image_url: { type: String },
  created_at: { type: Date, default: Date.now },
  is_available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', ProductSchema);
