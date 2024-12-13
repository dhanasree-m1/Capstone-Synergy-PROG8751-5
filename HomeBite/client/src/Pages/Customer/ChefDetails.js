import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";
import CartSummary from "../Customer/CartSummary";
import MainLayout from "../../Components/Layouts/MainLayout";

export default function ChefDetails() {
  const navigate = useNavigate();
  const { chefId } = useParams(); // Extract chefId from the URL
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [showCart, setShowCart] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));
  };

  const incrementQuantity = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: prevCart[productId] + 1,
    }));
  };

  const decrementQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId] > 1) {
        updatedCart[productId] -= 1;
      } else {
        delete updatedCart[productId];
      }
      return updatedCart;
    });
  };

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
      <MainLayout cart={cart} handleShowCart={() => setShowCart(true)} />
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
                chef.products.map((product) => (
                  <Col md={6} key={product.id}>
                    <Card className="mb-3">
                      <Card.Img variant="top" src={product.image_url || "default-image.jpg"} />
                      <Card.Body>
                        <h5>{product.name}</h5>
                        <p>${product.price?.toFixed(2)}</p>
                        {cart[product.id] > 0 ? (
                          <div className="cart-controls d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              onClick={() => decrementQuantity(product.id)}
                            >
                              -
                            </Button>
                            <span className="mx-2">{cart[product.id]}</span>
                            <Button
                              variant="outline-secondary"
                              onClick={() => incrementQuantity(product.id)}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button variant="primary" onClick={() => addToCart(product.id)}>
                            Add to Cart
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Alert variant="warning">No products found!</Alert>
              )}
                                <Button variant="secondary mb-2 mt-3 " onClick={() => navigate("/")}>
          Order More
        </Button>
            </Row>
          </Col>
        </Row>
      </Container>
      <CartSummary
        show={showCart}
        handleClose={() => setShowCart(false)}
        cart={cart}
        products={chef.products || []} // Pass chef's products to CartSummary
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />
    </>
  );
}
