import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chef_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  rider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending','Waiting Pickup', 'In Progress', 'Completed', 'Cancelled'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order_Item' }],
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' } 
});

export const Orders = mongoose.model('Order', OrderSchema);
