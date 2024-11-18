import { FaSearch, FaShoppingCart } from "react-icons/fa";
import Button from "react-bootstrap/esm/Button";
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
import "./Header.scss";

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
  const urole = localStorage.getItem("urole");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("login urole", urole);
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("urole"); // Clear the urole value
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/Login");
    }
  };

  return (
    <>
      {/* Primary Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary site-header">
        <Container fluid>
          <Row className="w-100">
            <Col className="d-flex justify-content-between align-items-center">
              <Navbar.Brand href="/">
                <img src={Logo} className="logo" alt="Logo" />
              </Navbar.Brand>
              <div className="d-flex align-items-center justify-content-between">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="d-flex gap-2 justify-content-between">
                    <Nav.Link
                      href="/"
                      className={`btn-link ${currentRole === "home" ||
                          ["customer", "chef", "rider"].includes(currentRole)
                          ? "active"
                          : ""
                        }`}
                    >
                      Home
                    </Nav.Link>
                    {urole && (
                      <div className="cart-icon d-flex gap-2">
                        <Nav className=" b-0">
                          {urole === "customer" && (
                            <Nav.Link
                              href="/customer/dashboard"
                              active={currentRole === "customer"}
                              onClick={() => onRoleSelect("customer")}
                            >
                              Customer
                            </Nav.Link>
                          )}
                          {/* {urole === "chef" && (
                            <Nav.Link
                            className={`cart-icon d-flex p-0 align-items-baseline ${
                              currentRole === "chef"
                                ? "active"
                                : ""
                            }`}
                              
                              href="/chef/orders"
                              active={currentRole === "chef"}
                              onClick={() => onRoleSelect("chef")}
                            >
                              <div className="position-relative ">
                                <span className="material-icons align-middle">
                                  coffee
                                </span>
                              </div>
                              <h6 className="mb-0 mx-2 btn-link">
                                Chef Dashboard
                              </h6>
                            </Nav.Link>
                          )} */}
                          {urole === "chef" && (
                            <Nav.Link
                              className={`cart-icon d-flex p-0 align-items-baseline ${currentRole === "chef" ? "active" : " "
                                }`}
                              href="/chef/orders"
                              onClick={() => onRoleSelect("chef")}
                            >
                              <div className="position-relative header-icon">
                                <span className="material-icons align-middle">
                                  room_service
                                </span>
                              </div>
                              <h6 className="mb-0 mx-2 btn-link">
                                Chef Dashboard
                              </h6>
                            </Nav.Link>
                          )}

                          {urole === "rider" && (
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
                    <div
                      className="cart-icon d-flex gap-2"
                      onClick={showCartSummary}
                    >
                      <div className="position-relative  header-icon">
                        <span className="material-icons align-middle">
                          shopping_cart
                        </span>
                        {totalItems > 0 && (
                          <Badge bg="danger" pill className="position-absolute">
                            {totalItems}
                          </Badge>
                        )}
                      </div>
                      <h6 className="mb-0 mx-2 btn-link">Cart</h6>
                    </div>
                    <Nav.Link onClick={handleLoginLogout} className="btn-link">
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
      {/* {urole && (
        <div className="role-navbar">
          <Nav className="nav nav-tabs">
            {urole === "customer" && (
              <Nav.Link
                href="/customer/dashboard"
                active={currentRole === "customer"}
                onClick={() => onRoleSelect("customer")}
              >
                Customer
              </Nav.Link>
            )}
            {urole === "chef" && (
              <Nav.Link
                href="/chef/orders"
                active={currentRole === "chef"}
                onClick={() => onRoleSelect("chef")}
              >
                <span class="material-icons">coffee</span> Chef Dashboard
              </Nav.Link>
            )}
            {urole === "rider" && (
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
      )} */}
    </>
  );
}
