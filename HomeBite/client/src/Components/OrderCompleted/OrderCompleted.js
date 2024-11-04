import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import OrderDetails from './OrderDetails'; // Make sure this component displays each order detail
import { GET_COMPLETED_ORDERS } from './queries'; // Adjust the path as needed

const OrderCompleted = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      client
        .query({
          query: GET_COMPLETED_ORDERS
        })
        .then(response => {
          setOrders(response.data.completedOrders);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching completed orders:', err);
          setError(err);
          setLoading(false);
        });
    }, []);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    return (
      <div>
        <h2>Completed Orders</h2>
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.order_id} className="order">
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Customer Name:</strong> {order.customer.first_name} {order.customer.last_name}</p>
              <p><strong>Delivery Address:</strong> {order.customer.address_line_1}, {order.customer.city}, {order.customer.province}</p>
              <p><strong>Grand Total:</strong> ${order.total_amount.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {order.payment_method || 'N/A'}</p>
              <p><strong>Completion Time:</strong> {new Date(order.completion_time).toLocaleString()}</p>
              <p><strong>Delivery Agent:</strong> {order.delivery_agent.first_name} {order.delivery_agent.last_name}</p>
              <h4>Items Ordered:</h4>
              {order.items.map(item => (
                <div key={item.product_id}>
                  <p>Item: {item.product_name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Unit Price: ${item.unit_price.toFixed(2)}</p>
                  {item.special_request && <p>Special Request: {item.special_request}</p>}
                </div>
              ))}
              <hr />
            </div>
          ))
        ) : (
          <p>No completed orders found.</p>
        )}
      </div>
    );
  };
  
  export default OrderCompleted;