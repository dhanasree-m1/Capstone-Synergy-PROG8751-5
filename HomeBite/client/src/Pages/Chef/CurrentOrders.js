import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import Logo from "../../assets/images/logo.svg";
import "./CurrentOrders.scss"; // Import the SCSS file

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the server on component mount
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
              getCurrentOrders {
                _id
                status
                total_amount
                created_at
                customer_id {
                  first_name
                  last_name
                  email
                  address_line_1
                  address_line_2
                  city
                  province
                  postal_code
                  country
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
      console.log("GraphQL response:", json); // Log the response for debugging
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      setOrders(json.data.getCurrentOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleAction = async (orderId, action) => {
    try {
      await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation {
              updateOrderStatus(orderId: "${orderId}", status: "${action}") {
                success
                message
              }
            }
          `,
        }),
      });
      // Refresh the orders list after action
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Container fluid className="orders-page">
      <Row className="orders-header">
        <Col className="text-center">
          <img src={Logo} alt="HomeBite Logo" className="my-4" />
        </Col>
      </Row>

      <Row className="tabs">
        <button className="tab active">Current Orders</button>
        <button className="tab">Order Completed</button>
      </Row>

      <Table className="orders-table">
        <thead>
          <tr>
            <th>Order Details</th>
            <th>Customer Details</th>
            <th>Item Details</th>
            <th>Payment Details</th>
            <th>Order Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <p>Order No: {order._id}</p>
                  <p>Order Placed Time: {new Date(order.created_at).toLocaleString()}</p>
                </td>
                <td>
                  <p>{order.customer_id.first_name} {order.customer_id.last_name}</p>
                  <p>
                    Delivery Address: {order.customer_id.address_line_1}, {order.customer_id.city}, {order.customer_id.province}
                  </p>
                </td>
                <td>
                  {order.items.map((item, index) => (
                    <p key={index}>
                      {item.product_id.name} (Qty: {item.quantity})
                    </p>
                  ))}
                </td>
                <td>
                  {order.payment ? (
                    <>
                      <p>Payment Method: {order.payment.payment_method}</p>
                      <p>Grand Total: ${order.payment.amount}</p>
                    </>
                  ) : (
                    <p>Payment information not available</p>
                  )}
                </td>
                <td>
                  <p> {order.status}</p>
                  
                </td>
                <td className="action-buttons">
                  <Button
                    className="accept-button"
                    onClick={() => handleAction(order._id, "Waiting Pickup")}
                  >
                    Accept
                  </Button>
                  <Button
                    className="reject-button"
                    onClick={() => handleAction(order._id, "Cancelled")}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No current orders available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <footer className="footer">
        HomeBite @ 202X. All rights reserved.
      </footer>
    </Container>
  );
};

export default CurrentOrders;
