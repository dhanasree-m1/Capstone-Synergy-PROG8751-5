import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../Components/Layouts/MainLayout";
import CartSummary from "../Customer/CartSummary";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";


export default function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams(); // Extract productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  }); // Retrieve saved products from localStorage
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError("Product ID is missing from the URL.");
        setLoading(false);
        return;
      }

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
                  chef {
                    id
                    user {
                      first_name
                      last_name
                      address_line_1
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

        const fetchedProduct = data.data.getProductById;

        // Normalize product to include chef_id
        const normalizedProduct = {
          ...fetchedProduct,
          chef_id: fetchedProduct.chef.id,
        };

        setProduct(normalizedProduct);

        // Save product to localStorage if not already present
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts];
          if (!prevProducts.find((p) => p.id === normalizedProduct.id)) {
            updatedProducts.push(normalizedProduct);
            localStorage.setItem("products", JSON.stringify(updatedProducts));
          }
          return updatedProducts;
        });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

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

  const cartQuantity = cart[product?.id] || 0; // Get the current quantity of the product in the cart

  return (
    <>
      <MainLayout cart={cart} handleShowCart={() => setShowCart(true)} />
      <Container className="my-5">
        {product ? (
          <Row>
            <Col md={6}>
              <Card>
                <Card.Img
                  variant="top"
                  src={product.image_url || "default-image.jpg"}
                  alt={product.name || "Product Image"}
                />
              </Card>
            </Col>
            <Col md={6}>
              <h2>{product.name}</h2>
              <p className="text-secondary">{product.description || "No description available."}</p>
              <h4>Unit Price: ${product.price?.toFixed(2)}</h4>
              <h5>Chef: {`${product.chef?.user?.first_name} ${product.chef?.user?.last_name}` || "Unknown"}</h5>
              <h5>Campus: {`${product.chef?.user?.address_line_1}` || "Unknown"}</h5>
              {cartQuantity > 0 ? (
                <div className="quantity-controls d-flex align-items-center mt-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => decrementQuantity(product.id)}
                  >
                    -
                  </Button>
                  <span className="mx-3">{cartQuantity}</span>
                  <Button
                    variant="outline-secondary"
                    onClick={() => incrementQuantity(product.id)}
                  >
                    +
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </Button>
              )}
            </Col>
          </Row>
        ) : (
          <Alert variant="warning">Product not found!</Alert>
        )}
      </Container>
      <CartSummary
        show={showCart}
        handleClose={() => setShowCart(false)}
        cart={cart}
        products={products} // Pass all products to ensure correct lookup
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />
              <Button variant="btn btn-primary mb-2" onClick={() => navigate("/")}>
          Order More
        </Button>
    </>
  );
}
