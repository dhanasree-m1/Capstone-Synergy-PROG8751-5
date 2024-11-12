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
     // Client-side validation
  if (!loginData.email || !loginData.password) {
    setMessage("Please fill in both email and password.");
    return;
  }
 // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 // const emailPattern=/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
 const emailPattern= /^(?!.*\.\.)(?!.*@.*@)(?!.*\s)(?!.*[,'`])([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.(com|org|net|gov|edu|mil|info|biz|name|us|uk|ca|au|in|de|fr|cn|jp|br|ru|za|mx|nl|es|it|app|blog|shop|online|site|tech|io|ai|co|xyz|photography|travel|museum|jobs|health)$/;
 if (!emailPattern.test(loginData.email)) {
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
        localStorage.setItem("user_id", result.data.login.user.id);
        localStorage.setItem("uname", result.data.login.user.first_name);
        //console.log(result.data.login.token)
        //console.log(result.data.login.user.id)
        //console.log(localStorage.getItem("user_id"))
        navigate("/chef");
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
              <h2 className="form-title mt-5 mb-2">Sign In </h2>
              <h4 className="form-sub-title mb-3">
                {/* Sign in to enjoy the best home-cooked meals made with care! */}
              </h4>
              {message && <Alert variant="danger">{message}</Alert>}
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Email "
                  name="email" // Change from "username" to "email"
                  type="text"
                  placeholder="Email"
                  autoComplete="email" // Good practice
                  onChange={handleChange} // Use handleChange here
                />
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  
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
                  <p>
                    <a href="/forgot-password" className="App-link">
                    Forgot Password?
                  </a>
                  </p>
                  
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
