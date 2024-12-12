import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "./OrderCompleted.scss";

const OrderCompleted = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const chef_id=localStorage.getItem("user_id")
    console.log("chefid",chef_id)
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              getCompletedOrders(chef_id: "${chef_id}") {
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
      setOrders(json.data.getCompletedOrders || []); // Ensure orders is an array
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <Row>
      <div className='col-12 mb-3 mt-3'>
        <h2>Welcome back, {localStorage.getItem('uname')}</h2>
        <h6>Track, manage and forecast your customers and orders.</h6>
      </div>
      <div className='col-12 col-lg-6 col-xl-3'>
        <div className='card alert alert-primary'>
          <div className='card-body'>
            <h5>Today's orders</h5>
            <h3>24</h3>
          </div>
        </div>
      </div>
      <div className='col-12 col-lg-6 col-xl-3'>
        <div className='card alert alert-success'>
          <div className='card-body'>
            <h5>Today's Earnings</h5>
            <h3>$ 1,210</h3>
          </div>
        </div>
      </div>
      <div className='col-12 col-lg-6 col-xl-3'>
        <div className='card alert alert-warning'>
          <div className='card-body'>
            <h5>Total orders</h5>
            <h3>24</h3>
          </div>
        </div>
      </div>
      <div className='col-12 col-lg-6 col-xl-3'>
        <div className='card alert alert-danger'>
          <div className='card-body'>
            <h5>Total Earnings</h5>
            <h3>$ 1,210</h3>
          </div>
        </div>
      </div>
      {/* <Header /> */}
      <div className="col-12 mt-2">
        <h2>Orders</h2>
        <div className="tab-selector">
          <Link to="/chef/orders" className="tab ">Current Orders</Link>
          <Link to="/chef/orders/Completed" className="tab active">Order Completed</Link>
        </div>
      </div>
      <div className="col-12">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="card mb-3 order-card" key={order._id}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5 class="card-title">{order.customer_id?.first_name} {order.customer_id?.last_name}
                    </h5>
                  </div>
                  <div className="col-md-6 text-end mb-3">
                    <span class="badge rounded-pill text-bg-light text-wrap">
                      <span className="material-icons link-color me-2">location_on</span>Delivery Address: {order.customer_id?.address_line_1 || "N/A"},{" "}
                      {order.customer_id?.city || "N/A"},{" "}
                      {order.customer_id?.province || "N/A"}
                    </span>
                  </div>
                  <div className="col-md-12 text-muted small">Order No :# {order.order_no}</div>
                  <div className="col-md-12 mb-3">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <span class="badge rounded-pill text-bg-light me-3" key={index}>
                          {item.product_id?.name || "Unknown Product"} x
                          {item.quantity}
                        </span>
                      ))
                    ) : (
                      <small>No items available</small>
                    )}
                  </div>
                  <div className="col-md-6 text-muted small d-lg-flex gap-2">
                    <div className="mb-2"><span className="material-icons link-color me-1">schedule</span>{new Date(order.created_at).toLocaleString()}
                    </div>
                    {order.payment ? (
                      <>
                        <div className="mb-2"> <span className="material-icons link-color me-1">attach_money</span>${order.payment.amount.toFixed(2)}</div>
                        <div className="mb-2"><span class="badge rounded-pill text-bg-success"><span className="material-icons">check_circle</span> {order.payment.payment_method}</span></div>
                      </>
                    ) : (
                      <span className="badge rounded-pill text-bg-warning">Payment information not available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">
            No completed orders available.
          </p>
        )}
      </div>
    </Row>
  );
};

export default OrderCompleted;
