import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
import loginbg from "../../assets/images/login-bg.jpg";
import Logo from "../../assets/images/logo.svg";
import InputField from "../../Components/InputField/InputField";
import Checkbox from "../../Components/Checkbox/Checkbox";
import RadioButton from "../../Components/RadioButton/RadioButton";
import Button from "../../Components/Button/Button";
import RoleOptions from "../../Components/RoleOptions/RoleOptions";
import { Container, Row, Col, Alert } from "react-bootstrap";

const Register = () => {
  const [step, setStep] = useState(1);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    gender: "",
    roles: {
      customer: false,
      chef: false,
      rider: false,
    },
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changed field: ${name}, New value: ${value}`); // Debugging line
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      roles: {
        ...prevData.roles,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const { roles } = registerData;
      if (!roles.customer && !roles.chef && !roles.rider) {
        setMessage("Please select at least one role to proceed.");
        return;
      }
      setStep(2);
    } else {
      console.log("Registration Data:", registerData);
      navigate("/home"); // Navigate to home after successful registration
    }
  };

  const selectedRolesCount = Object.values(registerData.roles).filter(
    Boolean
  ).length;

  return (
    <Container fluid>
      <Row>
        <Col md={7} className="p-0">
          <div className="login-container">
            <div className="login-box">
              <img src={Logo} className="logo" alt="Logo" />
              {step === 1 && (
                <h2 className="form-title mt-5 mb-2">
                  Get Started with HomeBite
                </h2>
              )}
              {step === 1 && (
                <p className="mb-4">
                  Enjoy the best home-cooked meals delivered to your doorstep.
                </p>
              )}
              {message && <Alert variant="danger">{message}</Alert>}

              <form onSubmit={handleSubmit} className="row p-0 mt-5">
                {step === 1 && (
                  <>
                    <Col md={6}>
                      <InputField
                        label="First Name"
                        name="firstName"
                        placeholder="Enter your First Name"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Last Name"
                        name="lastName"
                        placeholder="Enter your Last Name"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Create a Password"
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Confirm Password"
                        type="password"
                        name="confirmpassword"
                        placeholder="Re-enter your password to confirm"
                      />
                    </Col>
                    <Col md={12}>
                      <h5 className="form-sub-title">Select your Gender</h5>
                      <div className="gender-options">
                        <RadioButton label="Male" name="gender" value="male" />
                        <RadioButton
                          label="Female"
                          name="gender"
                          value="female"
                        />
                        <RadioButton
                          label="Other"
                          name="gender"
                          value="other"
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Your Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Mobile Number"
                        name="mobile"
                        placeholder="Mobile Number"
                      />
                    </Col>
                    <Col md={12}>
                      <RoleOptions
                        roles={registerData.roles}
                        onRoleChange={handleRoleChange}
                      />
                    </Col>
                    <Col md={12}>
                      <Button type="submit" className="btn-primary w-100 mb-3">
                        Proceed
                      </Button>
                    </Col>
                    <Col md={12}>
                    <p className="text-center">
                          Already Have an Account?{" "}
                          <a href="/login" className="btn btn-link">
                            Sign in here
                          </a>
                        </p>
                    </Col>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Col md={12}>
                      <div className="additional-details">
                        <h2 className="form-title">Additional Information</h2>
                        <hr />
                        <h3>Step 1 of {selectedRolesCount}</h3>
                        <h4 className="form-sub-title">
                          For {selectedRolesCount > 1 ? "Customer" : "Customer"}
                        </h4>
                        <hr />
                        <InputField
                          label="Address"
                          name="address"
                          placeholder="Start Typing Your Address"
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <InputField
                        label="Flat / House Number"
                        name="flat"
                        placeholder="Flat / House Number"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField label="City" name="city" placeholder="City" />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Province"
                        name="province"
                        placeholder="Province"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Postal Code"
                        name="postalCode"
                        placeholder="Postal Code"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Country"
                        name="country"
                        placeholder="Country"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Nearby Landmark (optional)"
                        name="landmark"
                        placeholder="Nearby Landmark (optional)"
                      />
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-3">
                        <Button
                          type="button"
                          className="btn-secondary w-100"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                      </div>
                    </Col>
                    <Col md={6}>
                      <Button type="submit" className="btn-primary w-100">
                        Submit
                      </Button>
                    </Col>
                  </>
                )}

                {step === 3 && registerData.roles.rider && (
                  <div className="additional-details">
                    <h2 className="form-title">Additional Information</h2>
                    <hr />
                    <h3 className="form-sub-title">Step 2 of 3</h3>
                    <h4>For Rider</h4>
                    <hr />
                    <h5 className="form-sub-title">Vehicle Information</h5>
                    <InputField
                      label="Vehicle Type"
                      name="vehicleType"
                      as="select"
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="Bike">Bike</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Car">Car</option>
                      <option value="Other">Other</option>
                    </InputField>
                    <InputField
                      label="Vehicle Registration Number"
                      name="vehicleRegNumber"
                      placeholder="Vehicle Registration Number"
                    />
                    {/* Additional fields for insurance and driver info */}
                    <div className="d-flex justify-content-between mb-3">
                      <Button type="button" className="btn-secondary">
                        Back
                      </Button>
                      <Button type="submit" className="btn-primary">
                        Proceed
                      </Button>
                    </div>
                    <div className="auth-links d-flex justify-content-between">
                      <p>
                        New to HomeBite?{" "}
                        <a href="/register" className="btn btn-link">
                          Create an account
                        </a>
                      </p>
                      <a href="/forgot-password" className="btn btn-link">
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          <footer>
            <div className="d-flex justify-content-between footer-container">
              <p>HomeBite © All Rights Reserved</p>
              <div className="d-flex link-color">
                <i className="material-icons mx-2">email</i>
                <p className="align-middle">help@homebite.com</p>
              </div>
            </div>
          </footer>
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
          <div
            id="textCarousel"
            className="carousel slide position-absolute mb-3"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner w-50">
              <div className="carousel-item active">
                <div className="d-block p-3 text-white h3 text-carousel">
                  “Home-cooked meals, made by the community, for the community.”
                </div>
              </div>
              <div className="carousel-item">
                <div className="d-block p-3 text-white h3 text-carousel">
                  Second Text Slide
                </div>
              </div>
              <div className="carousel-item">
                <div className="d-block p-3 text-white h3 text-carousel">
                  Third Text Slide
                </div>
              </div>
            </div>
            <div className="position-relative w-50 mx-3 d-flex">
              <button
                className="carousel-control-prev position-relative w-auto"
                type="button"
                data-bs-target="#textCarousel"
                data-bs-slide="prev"
              >
                <i className="material-icons">arrow_circle_left</i>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next position-relative w-auto mx-3"
                type="button"
                data-bs-target="#textCarousel"
                data-bs-slide="next"
              >
                <i className="material-icons">arrow_circle_right</i>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
