import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CHEF_DETAILS } from "../../queries";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";
import ProductCard from "../../Components/ProductCard/ProductCard";

export default function ChefDetails() {
  const { chefId } = useParams(); // Extract chefId from the URL
  const { loading, error, data } = useQuery(GET_CHEF_DETAILS, {
    variables: { id: chefId },
  });

  if (loading) return <Loader />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  const chef = data?.getChefById;

  if (!chef) {
    return (
      <Container>
        <Alert variant="warning">Chef not found!</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={chef.user.profilePicture} />
            <Card.Body>
              <h3>{chef.user.name}</h3>
              <p>{chef.bio}</p>
              <p className="text-secondary">
                Located at: {chef.user.address_line_1}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h4>Dishes by {chef.user.name}</h4>
          <Row>
            {chef.products.length > 0 ? (
              chef.products.map((product) => (
                <Col md={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <Alert variant="warning">No products found!</Alert>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
