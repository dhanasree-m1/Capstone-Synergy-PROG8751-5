import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import StatsCard from "../../Components/StatusCard/StatusCard";
// import Header from '../../Components/Header/Header';
import "./chef.scss"; // Import the SCSS file

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    todaysOrders: 0,
    todaysEarnings: 0,
    totalOrders: 0,
    totalEarnings: 0,
  });


  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    const chef_id=localStorage.getItem("user_id")
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              getCurrentOrders(chef_id: "${chef_id}") {
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
  const fetchStats = async () => {
    const chef_id = localStorage.getItem("user_id");
    try {
        const response = await fetch("http://localhost:5000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                  query {
                    getChefStats(chef_id: "${chef_id}") {
                      todaysOrders
                      todaysEarnings
                      totalOrders
                      totalEarnings
                    }
                  }
                `,
            }),
        });
        const json = await response.json();
        if (json.errors) {
            throw new Error(json.errors[0].message);
        }

        // Ensure data is handled properly
        const stats = json.data.getChefStats;

        setStats({
            todaysOrders: parseInt(stats.todaysOrders, 10) || 0, // Convert to integer
            todaysEarnings: stats.todaysEarnings ? parseFloat(stats.todaysEarnings) : 0.0, // Convert to float
            totalOrders: parseInt(stats.totalOrders, 10) || 0, // Convert to integer
            totalEarnings: stats.totalEarnings ? parseFloat(stats.totalEarnings) : 0.0, // Convert to float
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
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
    <Row>
      <div className='col-12 mb-3 mt-3'>
        <h2>Welcome back,Chef {localStorage.getItem('uname')}</h2>
        <h6>Track, manage and forecast your customers and orders.</h6>
      </div>
        {/* Render StatsCard components */}
        <StatsCard title="Today's Orders" value={stats.todaysOrders} variant="primary" />
      <StatsCard title="Today's Earnings" value={stats.todaysEarnings} variant="success" />
      <StatsCard title="Total Orders" value={stats.totalOrders} variant="warning" />
      <StatsCard title="Total Earnings" value={stats.totalEarnings} variant="danger" />
      {/* <div className='col-12 col-lg-6 col-xl-3'>
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
      </div> */}

      {/* <Header /> */}
      <div className="col-12 mt-2">
        <h2>Orders</h2>
        <div className="tab-selector">
          <Link to="/chef/orders" className="tab active">Current Orders</Link>
          <Link to="/chef/orders/completed" className="tab">Order Completed</Link>

        </div>
      </div>
      <div className="col-12">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="card mb-3 order-card" key={order._id}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5 class="card-title">{order.customer_id.first_name} {order.customer_id.last_name}</h5>
                  </div>
                  <div className="col-md-6 text-end mb-3">
                    <span class="badge rounded-pill text-bg-light text-wrap"><span className="material-icons link-color me-2">location_on</span>Delivery Address: {order.customer_id.address_line_1}, {order.customer_id.city}, {order.customer_id.province}</span>
                  </div>
                  <div className="col-md-12 text-muted small">Order No :# {order.order_no}</div>
                  <div className="col-md-12 mb-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <span class="badge rounded-pill text-bg-light me-3" key={index}>
                          {item.product_id ? item.product_id.name : "Product not available"} x {item.quantity}
                        </span>
                      ))
                    ) : (
                      <small>No items available</small>
                    )}
                  </div>
                  <div className="col-md-6 text-muted small d-lg-flex gap-2">
                    <div className="mb-2"><span className="material-icons link-color me-1">schedule</span>{new Date(order.created_at).toLocaleString()}</div>
                    {order.payment ? (
                      <>
                        <div className="mb-2"> <span className="material-icons link-color me-1">attach_money</span>{order.payment.amount}</div>
                        <div className="mb-2"><span class="badge rounded-pill text-bg-success"><span className="material-icons">check_circle</span> {order.payment.payment_method}</span></div>
                      </>
                    ) : (
                      <span class="badge rounded-pill text-bg-warning">Payment information not available</span>
                    )}
                  </div>
                  <div className="col-lg-6 text-lg-end">
                    {order.status === "Pending" ? (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleAction(order._id, "Waiting Pickup")} className="small me-3"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="error"
                          onClick={() => handleAction(order._id, "Cancelled")} className="small"
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span class="badge rounded-pill text-bg-light"> {order.status}</span>
                    )}

                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">

            No current orders available.

          </p>
        )}
      </div>

    </Row>
  );
};

export default CurrentOrders;