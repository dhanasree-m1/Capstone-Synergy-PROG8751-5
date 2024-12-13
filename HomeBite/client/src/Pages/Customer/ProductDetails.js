import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";

export default function ProductDetails() {
  const { productId } = useParams(); // Extract productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch product details by directly calling the resolver through the API
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetProductById($id: ID!) {
                getProductById(id: $id) {
                  id
                  name
                  description
                  price
                  image_url
                  dietary
                  is_available
                  chef {
                    id
                    specialty_cuisines
                    type_of_meals
                    user {
                      first_name
                      last_name
                      address_line_1
                      address_line_2
                    }
                  }
                }
              }
            `,
            variables: { id: productId },
          }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message || "Failed to fetch product details");
        }

        setProduct(data.data.getProductById);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) return <Loader />;
  if (error) return <Alert variant="danger">{error}</Alert>;
console.log("Product::",product)
  if (!product) {
    return (
      <Container>
        <Alert variant="warning">Product not found!</Alert>
      </Container>
    );
  }

  const chefName =
    product.chef?.user?.first_name && product.chef?.user?.last_name
      ? `${product.chef.user.first_name} ${product.chef.user.last_name}`
      : "Unknown Chef";
      const chefAddress =
      product.chef?.user?.address_line_1 && product.chef?.user?.address_line_2
        ? `${product.chef.user.address_line_1} ${product.chef.user.address_line_2}`
        : "Unknown Address";

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={product.image_url || "default-image-url.jpg"}
              alt={product.name || "Product Image"}
            />
          </Card>
        </Col>
        <Col md={6}>
          <h2>{product.name || "Product Name Not Available"}</h2>
          <p className="text-secondary">{product.description || "No description available."}</p>
          <h4>Price: ${product.price?.toFixed(2) || "0.00"}</h4>
          <h5>Prepared by: {chefName}</h5>
          <h5>Location: {chefAddress}</h5>
          <Button variant="primary">Add to Cart</Button>
        </Col>
      </Row>
    </Container>
  );
}
