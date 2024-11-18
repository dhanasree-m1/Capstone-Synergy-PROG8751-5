import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  chef_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number },
  image_url: { type: String },
  dietary:{ type: String, enum: ['Veg', 'Non Veg'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  is_available: { type: Boolean, default: true }
});

export const Product = mongoose.model('Product', ProductSchema);