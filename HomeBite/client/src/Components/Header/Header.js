import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Badge } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import "./Header.scss";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import { useEffect, useState } from "react";

export default function Header({
  cart = {},
  roles = {},
  currentRole,
  onRoleSelect,
  showCartSummary,
}) {
  const totalItems = cart
    ? Object.values(cart).reduce((sum, qty) => sum + qty, 0)
    : 0; // Default to 0 if cart is undefined or null

  const navigate = useNavigate();
  const shouldShowRoleNavbar = roles.chef || roles.rider || roles.customer;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user_id exists in local storage
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // If logged in, log out the user
      localStorage.removeItem("user_id");
      setIsLoggedIn(false);
      navigate("/"); // Redirect to home or another page after logout
    } else {
      // If not logged in, navigate to login page
      navigate("/Login");
    }
  };

  return (
    <>
      {/* Primary Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/">
            <img src={Logo} className="logo" alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Form className="d-flex w-100 me-4">
                <InputGroup className="mb-0">
                  <InputGroup.Text id="basic-addon1">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search For Food Items"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </Form>
              <Nav.Link href="/">Home</Nav.Link>
              <div className="cart-icon" onClick={showCartSummary}>
                <FaShoppingCart size={24} />
                {totalItems > 0 && <Badge bg="danger">{totalItems}</Badge>}
              </div>
              <Button
                variant="dark"
                onClick={handleLoginLogout}
                className="me-3"
              >
                {isLoggedIn ? "Logout" : "Login"}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Conditional Role Navbar */}
      {shouldShowRoleNavbar && (
        <div className="role-navbar">
          <Nav className="justify-content-center">
            {roles.customer && (
              <Nav.Link
                href="/customer/dashboard"
                active={currentRole === "customer"}
                onClick={() => onRoleSelect("customer")}
              >
                Customer
              </Nav.Link>
            )}
            {roles.chef && (
              <Nav.Link
                href="/chef/dashboard"
                active={currentRole === "chef"}
                onClick={() => onRoleSelect("chef")}
              >
                Chef
              </Nav.Link>
            )}
            {roles.rider && (
              <Nav.Link
                href="/rider/dashboard"
                active={currentRole === "rider"}
                onClick={() => onRoleSelect("rider")}
              >
                Rider
              </Nav.Link>
            )}
          </Nav>
        </div>
      )}
    </>
  );
}
