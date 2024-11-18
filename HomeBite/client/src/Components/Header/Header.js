import { FaSearch, FaShoppingCart } from "react-icons/fa";
import Button from "react-bootstrap/esm/Button";
import "./Header.scss";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import { useEffect, useState } from "react";
import {
  Container,
  Nav,
  Navbar,
  InputGroup,
  Badge,
  Col,
  Row,
} from "react-bootstrap";

export default function Header({
  cart = {},
  roles = {},
  currentRole,
  onRoleSelect,
  showCartSummary,
}) {
  const totalItems = cart
    ? Object.values(cart).reduce((sum, qty) => sum + qty, 0)
    : 0;

  const navigate = useNavigate();
  const shouldShowRoleNavbar = roles.chef || roles.rider || roles.customer;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("user_id");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/Login");
    }
  };

  return (
    <>
      {/* Primary Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid >
          <Row className="w-100">
            <Col className="d-flex justify-content-between align-items-center">
              <Navbar.Brand href="/">
                <img src={Logo} className="logo" alt="Logo" />
              </Navbar.Brand>
              <div className="d-flex align-items-center justify-content-between">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="d-flex gap-2 justify-content-between">
                    <Nav.Link href="/" className="btn-link">Home</Nav.Link>
                    <div className="cart-icon d-flex gap-2" onClick={showCartSummary}>
                      <div className="position-relative mx-1">
                      <FaShoppingCart size={18} className="btn-link" />
                      {totalItems > 0 && (
                        <Badge bg="danger" pill className="position-absolute">
                          {totalItems}
                        </Badge>
                      )}
                      </div>
                      <h6 className="mb-0 mx-2 btn-link">Cart</h6>
                    </div>
                    <Nav.Link
                      onClick={handleLoginLogout}
                      className="btn-link"
                    >
                      {isLoggedIn ? "Logout" : "Login"}
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </div>
            </Col>
          </Row>
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
