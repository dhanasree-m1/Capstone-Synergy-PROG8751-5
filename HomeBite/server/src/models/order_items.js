import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  special_request: { type: String },
  unit_price: { type: Number, required: true }
});

 export const OrderItem = mongoose.model('Order_Item', OrderItemSchema);
 //export default 
