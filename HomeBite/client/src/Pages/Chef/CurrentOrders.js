import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
// import Header from '../../Components/Header/Header';
import "./chef.scss"; // Import the SCSS file

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);

  
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
                order_no
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
    <Row fluid className="orders-page">
      <div className='row'>
              <div className='col-12 mb-5'>
                <h2>Welcome back, {localStorage.getItem('uname')}</h2>
                <h6>Track, manage and forecast your customers and orders.</h6>
              </div>
            </div>
      <div className='col-3'>
        <div className='card alert alert-primary'>
          <div className='card-body'>
            <h5>Today's orders</h5>
            <h3>24</h3>
          </div>
        </div>
      </div>
      <div className='col-3'>
        <div className='card alert alert-success'>
          <div className='card-body'>
            <h5>Today's Earnings</h5>
            <h3>$ 1,210</h3>
          </div>
        </div>
      </div>
      <div className='col-3'>
        <div className='card alert alert-warning'>
          <div className='card-body'>
            <h5>Total orders</h5>
            <h3>24</h3>
          </div>
        </div>
      </div>
      <div className='col-3'>
        <div className='card alert alert-danger'>
          <div className='card-body'>
            <h5>Total Earnings</h5>
            <h3>$ 1,210</h3>
          </div>
        </div>
      </div>
      {/* <Header /> */}
      <h2>Orders</h2>
      <div className="tab-selector">
        <button className="tab active">Current Orders</button>
        <button className="tab ">Order Completed</button>
      </div>



      <Table >
        <thead>
          <tr>
            <th>Order Details</th>
            <th>Customer Details</th>
            <th>Item Details</th>
            <th>Payment Details</th>

            <th>Action</th>
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
                  <p><b>Name:</b> {order.customer_id.first_name} {order.customer_id.last_name}</p>
                  <p>
                    <b>Delivery Address:</b> {order.customer_id.address_line_1}, {order.customer_id.city}, {order.customer_id.province}
                  </p>
                </td>
                <td>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <p key={index}>
                        {item.product_id ? item.product_id.name : "Product not available"} (QNT: {item.quantity})
                      </p>
                    ))
                  ) : (
                    <p>No items available</p>
                  )}
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

                <td className="action-buttons">
                  {order.status === "Pending" ? (
                    <>
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
                    </>
                  ) : (
                    <p> {order.status}</p>
                  )}
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


    </Row>
  );
};

export default CurrentOrders;
