const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
  chef_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, ref: 'User', required: true },
  bio: { type: String },
  rating: { type: Number, default: 0 },
  reviews_count: { type: Number, default: 0 },
  earnings: { type: Number, default: 0.0 },
  location: { type: String }
});

module.exports = mongoose.model('Chef', ChefSchema);
