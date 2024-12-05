import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch('/api/orders/latest'); // Replace with your actual API
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);

        // Clear the cart once the order is successfully fetched
        localStorage.removeItem('cart');
      } catch (error) {
        console.error('Error fetching order details:', error);
        navigate('/error'); // Redirect to an error page if needed
      }
    };
    fetchOrder();
  }, [navigate]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1>Order #{order.order_no}</h1>
      <p>Status: {order.status}</p>
      <p>Total Amount: ${order.total_amount.toFixed(2)}</p>
      <h2>Items</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.product_id}>
            {item.quantity}x {item.product.name} (${item.unit_price.toFixed(2)} each)
          </li>
        ))}
      </ul>
    </div>
  );
}
