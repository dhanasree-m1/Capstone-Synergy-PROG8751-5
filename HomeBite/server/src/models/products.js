import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  chef_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  name: { type: String, required: true },
  description: { type: String },
  ingredients: { type: String },
  price: { type: Number, required: true },
  preparation_time: { type: Number },
  availability: { type: String, enum: ['daily', 'weekly'], required: true },
  image_url: { type: String },
  created_at: { type: Date, default: Date.now },
  is_available: { type: Boolean, default: true }
});

export const Product = mongoose.model('Product', ProductSchema);