import React, { useState } from "react";
import InputField from "../../Components/InputField/InputField";
import Button from "../../Components/Button/Button";
import { Container, Row, Col, Alert } from "react-bootstrap";
import loginbg from "../../assets/images/login-bg.jpg";
import Logo from "../../assets/images/logo.svg";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email ) {
        setMessage("Please enter the email.");
        return;
      }
      const emailPattern=/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      if (!emailPattern.test(email)) {
        setMessage("Please enter a valid email address.");
        return;
      }
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation {
              forgotPassword(email: "${email}") {
                message
              }
            }
          `,
        }),
      });
      
      const result = await response.json();
      if (result.errors) {
        setMessage(result.errors[0].message);
      } else {
        setMessage("Check your email for reset instructions.");
      }
    } catch (error) {
      setMessage("Error processing request");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={7} className="p-0">
    <div className="login-container">
    <div className="login-box">
    <img src={Logo} className="logo" alt="Logo" />
    <h2 className="form-title mt-5 mb-2">Forgot Password </h2>
      {message && <Alert variant="danger">{message}</Alert>}
      <form onSubmit={handleSubmit}>
        <InputField
          label="Enter your registered email"
          name="email"
          type="text"
          placeholder="Your Email Address"
          
          onChange={handleChange}
        />
        <Button type="submit" className="btn-primary w-100 mt-3">
          Send Reset Link
        </Button>
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

export default ForgotPassword;