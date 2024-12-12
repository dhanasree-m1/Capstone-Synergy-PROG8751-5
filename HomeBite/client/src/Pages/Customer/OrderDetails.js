import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_LATEST_ORDER } from "../../queries";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import MainLayout from "../../Components/Layouts/MainLayout";

export default function OrderDetails({ order }) {
  const [customerId, setCustomerId] = useState(
    localStorage.getItem("user_id") || null
  );
  const navigate = useNavigate();

  // Validate `customerId` and redirect if invalid
  useEffect(() => {
    if (!customerId || !/^[a-f\d]{24}$/i.test(customerId)) {
      console.error("Invalid or missing customer ID in localStorage");
      navigate("/Login");
    }
  }, [customerId, navigate]);

  const { loading, error, data } = useQuery(GET_LATEST_ORDER, {
    skip: !customerId || !/^[a-f\d]{24}$/i.test(customerId), // Skip query if invalid
    variables: { customerId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  const {
    order_no,
    customer_id,
    chef_id,
    items,
    total_amount,
    status,
    created_at,
  } = data.getLatestOrder;

  return (
    <>
      <MainLayout />
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>Order Details</h1>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h5>Order Number:</h5>
            <p>{order_no}</p>
          </Col>
          <Col md={6}>
            <h5>Status:</h5>
            <p>{status}</p>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h5>Customer:</h5>
            <p>
              {customer_id.first_name} {customer_id.last_name} (
              {customer_id.email})
            </p>
          </Col>
          <Col md={6}>
  <h5>Chef:</h5>
  <p>
    {chef_id?.first_name} {chef_id?.last_name} <br />
    {chef_id?.address_yline_1}
  </p>
</Col>
        </Row>
        <hr />
        <h5>Order Items:</h5>
        {items.map((item) => (
          <Row key={item._id} className="mb-3">
            <Col md={4}>
              <img
                src={item.product_id.image_url}
                alt={item.product_id.name}
                className="img-fluid"
              />
            </Col>
            <Col md={4}>
              <h6>{item.product_id.name}</h6>
              <p>{item.product_id.description}</p>
            </Col>
            <Col md={4}>
              <p>Quantity: {item.quantity}</p>
              <p>Unit Price: {item.unit_price}</p>
            </Col>
          </Row>
        ))}
        <hr />
        <h5>Total Amount:</h5>
        <p>${total_amount.toFixed(2)}</p>
        <Button variant="primary" onClick={() => navigate("/Dashboard")}>
          Back to Dashboard
        </Button>
      </Container>
    </>
  );
}
