const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['superadmin', 'admin', 'chef', 'customer', 'rider'], required: true },
  profile_image: { type: String },
  status: { type: String, enum: ['active', 'inactive'], required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
