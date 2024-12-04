import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_DETAILS } from "../../queries";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";

export default function ProductDetails() {
  const { productId } = useParams(); // Extract productId from the URL
  const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id: productId },
  });

  if (loading) return <Loader />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  const product = data?.getProduct;

  if (!product) {
    return (
      <Container>
        <Alert variant="warning">Product not found!</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={product.image} alt={product.name} />
          </Card>
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <p className="text-secondary">{product.description}</p>
          <h4>Price: ${product.price}</h4>
          <h5>Prepared by: {product.chef.user.name}</h5>
          <Button variant="primary">Add to Cart</Button>
        </Col>
      </Row>
    </Container>
  );
}
