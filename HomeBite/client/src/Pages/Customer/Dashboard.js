import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHEFS_AND_PRODUCTS } from "../../queries";
import { Container, Alert, Col, Row, Dropdown, Form } from "react-bootstrap";
import Button from "../../Components/Button/Button";
import MainLayout from "../../Components/Layouts/MainLayout";
import Carousel from "../../Components/Carousel/Carousel";
import ChefCard from "../../Components/ChefCard/ChefCard";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { useLocation } from "react-router-dom";
import { campuses } from "../../Components/data/Campuses";
import CartSummary from "../Customer/CartSummary";

export default function Dashboard() {
  const [selectedCampus, setSelectedCampus] = useState(null);

  const { loading, error, data } = useQuery(GET_CHEFS_AND_PRODUCTS, {
    variables: { campus: selectedCampus },
  });
  const [viewAllChefs, setViewAllChefs] = useState(false);
  const [viewAllProducts, setViewAllProducts] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const successMessage = location.state?.successMessage;
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false); // State for cart modal visibility

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  const handleCampusSelect = (campus) => {
    setSelectedCampus(campus);
  };

  const handleResetCampus = () => {
    setSelectedCampus(null);
  };

  // Filter chefs and products based on the selected campus
  const filteredChefs = selectedCampus
    ? data.getAllChefs.filter((chef) => {
        console.log(
          `Filtering chef campus: ${chef.user.address_line_1} against selected campus: ${selectedCampus}`
        );
        return chef.user.address_line_1 === selectedCampus;
      })
    : data.getAllChefs; // If no campus is selected, show all chefs

  const filteredProducts = selectedCampus
    ? data.getAllProducts.filter((product) => {
        const address = product.chef?.user?.address_line_1 || "Unknown";
        console.log(
          `Filtering product: ${address} against campus: ${selectedCampus}`
        );
        return address === selectedCampus;
      })
    : data.getAllProducts;

    const searchedProducts = filteredProducts
    ? filteredProducts.filter(
        (product) =>
          product &&
          product.name &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  console.log("Selected Campus:", selectedCampus);
  console.log("Filtered Products:", data?.getAllProducts);

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

  return (
    <>
      <MainLayout cart={cart} handleShowCart={handleShowCart} />
      <Container fluid className="dashboard-container">
        <Row>
          {successMessage && (
            <Col md={12}>
              <Alert variant="success" className="my-3">
                {successMessage}
              </Alert>
            </Col>
          )}
          <Col md={12} className="mb-4">
            <Carousel />
          </Col>
          <Col md={6} className="mb-4">
            <Dropdown onSelect={handleCampusSelect}>
              <Dropdown.Toggle variant="secondary" id="dropdown-campus">
                {selectedCampus || "Select Campus"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {campuses.map((campus) => (
                  <Dropdown.Item key={campus.address} eventKey={campus.address}>
                    {campus.address}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button className="btn-secondary ms-2" onClick={handleResetCampus}>
              Reset
            </Button>
          </Col>
          <Col md={6} className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>

          {searchQuery ? (
            <Col md={12}>
              <h3>Search results for "{searchQuery}"</h3>
              <div className="product-list d-flex flex-wrap justify-content-center">
              {searchedProducts.length > 0 ? (
            searchedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cart={cart}
                addToCart={addToCart}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity} />
                  ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </Col>
          ) : (
            <>
              <Col md={12} className="top-picks-section mb-5">
                <h3>Top Picks</h3>
                <p>
                  Discover our most-loved homemade dishes at{" "}
                  {selectedCampus || "all campuses"}
                </p>
                <div className="product-list d-flex flex-wrap justify-content-center">
                  {data?.getAllProducts?.length > 0 ? (
                    data.getAllProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        cart={cart}
                        addToCart={addToCart}
                        incrementQuantity={incrementQuantity}
                        decrementQuantity={decrementQuantity}
                      />
                    ))
                  ) : (
                    <p>No products available for the selected campus.</p>
                  )}
                </div>
                <Button
                  className="btn-primary"
                  onClick={() => setViewAllProducts(!viewAllProducts)}
                >
                  {viewAllProducts ? "Show Less" : "View All"}
                </Button>
              </Col>
              <Col md={12} className="chefs-around-section mb-5">
                <h3>Chefs Around You</h3>
                <p>Connect with chefs at {selectedCampus || "all campuses"}</p>
                <div className="chef-list d-flex flex-wrap justify-content-center">
                  {filteredChefs.length > 0 ? (
                    filteredChefs
                      .slice(0, viewAllChefs ? filteredChefs.length : 4)
                      .map((chef) => <ChefCard key={chef.id} chef={chef} />)
                  ) : (
                    <p>No chefs available for the selected campus.</p>
                  )}
                </div>
                <Button
                  className="btn-primary"
                  onClick={() => setViewAllChefs(!viewAllChefs)}
                >
                  {viewAllChefs ? "Show Less" : "View All"}
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Container>
      <CartSummary
        show={showCart}
        handleClose={handleCloseCart}
        cart={cart}
        products={data.getAllProducts}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />
    </>
  );
}
