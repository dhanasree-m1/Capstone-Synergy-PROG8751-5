import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";
import Button from "react-bootstrap/esm/Button";
import "./Header.scss";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  
  // const handleLogin = () => {
  //   navigate("/Login");
  // };
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
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#home">
          <img src={Logo} className="logo" alt="Logo"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Apply ms-auto to push items to the right */}
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
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#cart">Cart</Nav.Link>
            
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
  );
}
