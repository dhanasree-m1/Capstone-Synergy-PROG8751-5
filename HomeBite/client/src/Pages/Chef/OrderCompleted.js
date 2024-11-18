// OrderCompleted.js

import Header from '../../Components/Header/Header';
import { useQuery, gql } from '@apollo/client';

import TableRow from '../../Components/Table/TableRow';
import TableCell from '../../Components/Table/TableCell';
import './OrderCompleted.scss';
import React, { useState, useEffect } from "react"; // Add useState and useEffect here
import { Container, Table } from "react-bootstrap"; // Add Container and Table imports

const OrderCompleted = () => {
  const [orders, setOrders] = useState([]);

  // Fetch completed orders from the server on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              completedOrders {
                _id
                order_no
                status
                total_amount
                created_at
                customer_id {
                  first_name
                  last_name
                  address_line_1
                  city
                  province
                }
                items {
                  product_id {
                    name
                  }
                  quantity
                  special_request
                  unit_price
                }
                payment {
                  payment_method
                  amount
                  payment_status
                }
              }
            }
          `,
        }),
      });
      const json = await response.json();
      console.log("GraphQL response:", json); // Debugging response
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      setOrders(json.data.completedOrders);
    } catch (error) {
      console.error("Error loading completed orders:", error);
    }
  };

  return (
    <Container fluid className="orders-page">
      <Header />
      <h2>Completed Orders</h2>
      <div className="tab-selector">
        <button className="tab">Current Orders</button>
        <button className="tab active">Order Completed</button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Order Details</th>
            <th>Customer Details</th>
            <th>Item Details</th>
            <th>Payment Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <p><b>Order No: # {order.order_no}</b></p>
                  <p>Order Placed Time: {new Date(order.created_at).toLocaleString()}</p>
                </td>
                <td>
                  <p><b>Name:</b> {order.customer_id?.first_name} {order.customer_id?.last_name}</p>
                  <p><b>Address:</b> {order.customer_id?.address_line_1}, {order.customer_id?.city}</p>
                </td>
                <td>
  {order.items?.length > 0 ? (
    order.items.map((item, idx) => (
      <p key={idx}>
        {item.product_id?.name || "Product not available"} x{item.quantity} - ${item.unit_price}
      </p>
    ))
  ) : (
    <p>No items available</p>
  )}
</td>

                <td>
                  <p>Payment Method: {order.payment?.payment_method}</p>
                  <p>Total: ${order.payment?.amount}</p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No completed orders available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrderCompleted;