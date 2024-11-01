import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import loginbg from "../../assets/images/login-bg.jpg";
import Logo from "../../assets/images/logo.svg";
import InputField from "../../Components/InputField/InputField";
import Button from "../../Components/Button/Button";
import { Container, Row, Col, Alert } from "react-bootstrap";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation {
              login(input: { email: "${loginData.email}", password: "${loginData.password}" }) {
                token
                user {
                  id
                  first_name
                  last_name
                  email
                }
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setMessage(result.errors[0].message); // Display error message
      } else {
        localStorage.setItem("token", result.data.login.token);
        navigate("/");
      }
    } catch (error) {
      setMessage("Error logging in");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={7} className="p-0">
          <div className="login-container">
            <div className="login-box">
              <img src={Logo} className="logo" alt="Logo" />
              <h2 className="form-title mt-5 mb-2">Sign In to HomeBite</h2>
              <h4 className="form-sub-title mb-3">
                Sign in to enjoy the best home-cooked meals made with care!
              </h4>
              {message && <Alert variant="danger">{message}</Alert>}
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Your Email Address"
                  name="email" // Change from "username" to "email"
                  type="text"
                  placeholder="Your Email Address"
                  required
                  autoComplete="email" // Good practice
                  onChange={handleChange} // Use handleChange here
                />
                <InputField
                  label="Your Password"
                  name="password"
                  type="password"
                  placeholder="Your Password"
                  required
                  autoComplete="current-password" // Add autocomplete
                  onChange={handleChange} // Use handleChange here
                />
                <Button type="submit" className="btn-primary w-100 mb-3">
                  Let's Go!
                </Button>
                <div className="auth-links d-flex justify-content-between">
                  <p>
                    New to HomeBite?{" "}
                    <a href="/register" className="App-link">
                      Create an account
                    </a>
                  </p>
                  <a href="/forgot-password" className="App-link">
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </Col>
        <Col
          md={5}
          className="d-flex align-items-center justify-content-center p-0 position-relative"
        >
          <div className="overlay position-absolute w-100 h-100"></div>
          <img
            src={loginbg}
            className="img-fluid login-bg w-100 h-100"
            alt="Background"
          />
          {/* Carousel omitted for brevity */}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
