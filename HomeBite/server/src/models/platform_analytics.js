const mongoose = require('mongoose');

const PlatformAnalyticsSchema = new mongoose.Schema({
  analytics_id: { type: Number, required: true, unique: true },
  total_orders: { type: Number },
  total_transactions: { type: Number },
  top_rated_chef: { type: Number, ref: 'Chef' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlatformAnalytics', PlatformAnalyticsSchema);
