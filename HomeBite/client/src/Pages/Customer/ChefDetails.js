import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";
import ProductCard from "../../Components/ProductCard/ProductCard";
import MainLayout from "../../Components/Layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import CartSummary from "../Customer/CartSummary";

export default function ChefDetails() {
  const navigate = useNavigate();
  const { chefId } = useParams(); // Extract chefId from the URL
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChefDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetChefById($id: ID!) {
                getChefById(id: $id) {
                  id
                  bio
                  specialty_cuisines
                  type_of_meals
                  user {
                    first_name
                    last_name
                    profile_image
                    address_line_1
                    address_line_2
                    city
                    province
                  }
                  products {
                    id
                    name
                    description
                    price
                    image_url
                    dietary
                  }
                }
              }
            `,
            variables: { id: chefId },
          }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message || "Failed to fetch chef details");
        }

        setChef(data.data.getChefById);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchChefDetails();
  }, [chefId]);

  if (loading) return <Loader />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!chef) {
    return (
      <Container>
        <Alert variant="warning">Chef not found!</Alert>
      </Container>
    );
  }

  const chefName = `${chef.user?.first_name || "Unknown"} ${chef.user?.last_name || ""}`;

  return (
    <>
    <MainLayout />
    <Container className="my-5">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={chef.user?.profile_image || "default-profile.jpg"} />
            <Card.Body>
              <h3>{chefName}</h3>
              <p>{chef.bio || "No bio available."}</p>
              <p className="text-secondary">
                Located at: {chef.user?.address_line_1 || "No address available"}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h4>Dishes by {chefName}</h4>
          <Row>
            {Array.isArray(chef.products) && chef.products.length > 0 ? (
              chef.products.map((product, index) => (
                <Col md={6} key={product.id || index}>
                  {product?.id ? (
                    <ProductCard product={product} />
                  ) : (
                    <Alert variant="warning">Product data is incomplete!</Alert>
                  )}
                </Col>
              ))
            ) : (
              <Alert variant="warning">No products found!</Alert>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
    </>
  );
}
