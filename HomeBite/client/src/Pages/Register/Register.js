import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
import axios from "axios";
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
    setRegisterData({ ...registerData, [name]: value });
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
      try {
        // Send the registration data to your API
        const response = await axios.post("http://localhost:5000/api/register", registerData);
        console.log("Registration Data:", response.data);
        navigate("/home"); // Navigate to home after successful registration
      } catch (error) {
        console.error("Error submitting registration:", error);
        setMessage("There was an error submitting your registration.");
      }
    }
  };

  const validateAddress = async (address) => {
    const API_KEY = "AIzaSyDNfZSpUAHgxQ_VnsNC4TLq_w2xlt2RoGU"; // Replace with your actual API key
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: API_KEY,
          },
        }
      );
      console.log("API Response:", response.data);
      if (response.data.status === "OK") {
        const place = response.data.results[0];
        setRegisterData({
          ...registerData,
          address: place.formatted_address,
          city:
            place.address_components.find((comp) =>
              comp.types.includes("locality")
            )?.long_name || "",
          province:
            place.address_components.find((comp) =>
              comp.types.includes("administrative_area_level_1")
            )?.short_name || "",
          postalCode:
            place.address_components.find((comp) =>
              comp.types.includes("postal_code")
            )?.long_name || "",
          country:
            place.address_components.find((comp) =>
              comp.types.includes("country")
            )?.long_name || "",
        });
        setMessage("");
      } else {
        setMessage(
          `Address validation failed: ${response.data.status}. Please try a different address.`
        );
      }
    } catch (error) {
      console.error("Error validating address:", error);
      setMessage(
        "An error occurred while validating the address. Please try again later."
      );
    }
  };

  const onAddressChange = async (e) => {
    const address = e.target.value;
    setRegisterData({ ...registerData, address });
    if (address.length > 0) {
      await validateAddress(address);
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
                        value={registerData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your First Name"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Last Name"
                        name="lastName"
                        value={registerData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your Last Name"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Create a Password"
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleChange}
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
                        <RadioButton
                          label="Male"
                          name="gender"
                          value="male"
                          onChange={handleChange}
                        />
                        <RadioButton
                          label="Female"
                          name="gender"
                          value="female"
                          onChange={handleChange}
                        />
                        <RadioButton
                          label="Other"
                          name="gender"
                          value="other"
                          onChange={handleChange}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Your Email Address"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Mobile Number"
                        name="mobile"
                        value={registerData.mobile}
                        onChange={handleChange}
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
                          value={registerData.address}
                          onChange={onAddressChange}
                          placeholder="Start Typing Your Address"
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <InputField
                        label="Flat / House Number"
                        name="flat"
                        value={registerData.flat}
                        onChange={handleChange}
                        placeholder="Flat / House Number"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="City"
                        name="city"
                        value={registerData.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Province"
                        name="province"
                        value={registerData.province}
                        onChange={handleChange}
                        placeholder="Province"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Postal Code"
                        name="postalCode"
                        value={registerData.postalCode}
                        onChange={handleChange}
                        placeholder="Postal Code"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Country"
                        name="country"
                        value={registerData.country}
                        onChange={handleChange}
                        placeholder="Country"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Nearby Landmark (optional)"
                        name="landmark"
                        value={registerData.landmark}
                        onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
