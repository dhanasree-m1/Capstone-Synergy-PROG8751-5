import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_LATEST_ORDER } from "../../queries";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Alert, Button, Card } from "react-bootstrap";
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
        <Row><div className="tab-selector">
          <Link to="/Customer/OrderDetails" className="tab ">Current Orders</Link>
          <Link to="/Customer/PastOrders" className="tab active">Past Orders</Link>
        </div></Row>
        
        <Row>
          <Col md={12}>
            <h1>Order Details</h1>
          </Col>

          <Col md={4}>
            <h5>Order Number:</h5>
            <p>{order_no}</p>
          </Col>
          <Col md={4}>
            <h5>Status:</h5>
            <p>{status}</p>
          </Col>

          <Col md={4}>
            <h5>Customer:</h5>
            <p>
              {customer_id.first_name} {customer_id.last_name} (
              {customer_id.email})
            </p>
          </Col>
          <Col md={4}>
  <h5>Chef:</h5>
  <p>
    {chef_id.first_name} {chef_id?.last_name} <br />
    {chef_id?.address_yline_1}
  </p>
</Col>
<Col md={12}>
        <h5>Total Amount:</h5>
        <p>${total_amount.toFixed(2)}</p>
        <Button variant="btn btn-primary mb-2" onClick={() => navigate("/")}>
          Order More
        </Button>
        </Col>
        <hr />
        <h5>Order Items:</h5>

  {items.map((item) => (
    <Col md={4} key={item._id}>
      <Card className="mb-4">
        <Card.Img
          variant="top"
          src={item.product_id.image_url}
          alt={item.product_id.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title>{item.product_id.name}</Card.Title>
          <Card.Text>{item.product_id.description}</Card.Text>
          <p>Quantity: {item.quantity}</p>
          <p>Unit Price: ${item.unit_price.toFixed(2)}</p>
        </Card.Body>
      </Card>
    </Col>
  ))}
        </Row>       
      </Container>
    </>
  );
}
