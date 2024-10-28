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
import { useMutation } from '@apollo/client';
import { CREATE_USER, UPDATE_USER, CREATE_RIDER, UPDATE_RIDER } from '../../queries';

const Register = () => {
  const [step, setStep] = useState(1);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    address2:"",
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
    nearby_landmark:"",
    // Rider-specific fields (NEW FIELDS ADDED)
    vehicleType: "",
    vehicleRegNumber: "",
    vehicleInsuranceNumber: "",
    insuranceExpiryDate: "",
    driverLicenseNumber: "",
    licenseExpiryDate: "",
    document_upload_path:"",
    preferredDeliveryRadius: "",
    preferredWorkingDays: [],
    preferredStartTime: "",
    preferredEndTime: "",
    longDistancePreference: false,
    emergencyContactName: "",
    emergencyContactNumber: "",
    relationship: "",
    profilePicture: null,
    // Payment information
    bankAccountNumber: "",
    transitNumber: "",
 
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [createUser] = useMutation(CREATE_USER);
  const [createRider] = useMutation(CREATE_RIDER);
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changed field: ${name}, New value: ${value}`); // Debugging line
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log("Updated registerData:", registerData); // Debugging line
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
    console.log("handleSubmit called"); // Debugging log to check if handleSubmit is triggered

    console.log("Current Step:", step); // Debugging log for current step
    if (step === 1) {
      const { roles } = registerData;
      console.log("Roles selected:", roles);
      if (!roles.customer && !roles.chef && !roles.rider) {
        setMessage("Please select at least one role to proceed.");
        return;
      }
      setStep(2);
    } else if (step === 2 ) {
      // Step 2: Register User data
      try {
        
        const userInput = {
          first_name: registerData.firstName || "",
          last_name: registerData.lastName || "",
          email: registerData.email || "",
          mobile_number: registerData.mobile || "",
          password_hash: registerData.password || "", // Ensure this is hashed if necessary
          role: Object.keys(registerData.roles).find((role) => registerData.roles[role]) || "",
          gender: registerData.gender || "Other", // Set a default gender value if none selected
          profile_image: registerData.profilePicture || "",
          status: "active",
          address_line_1: registerData.address || "",
          address_line_2: registerData.address2 || "",
          city: registerData.city || "",
          province: registerData.province || "",
          postal_code: registerData.postalCode || "",
          country: registerData.country || "",
          nearby_landmark: registerData.nearby_landmark || ""
        };
  
        // Log input data to ensure all fields are present and correctly mapped
        console.log("User input for registration:", userInput);
  
        const { data } = await createUser({ variables: { input: userInput } });
        console.log("User registered successfully:", data);
        if (data && data.createUser) {
          setRegisterData((prevData) => ({ ...prevData, user_id: data.createUser.id }));
         // navigate("/home");
        } else {
          setMessage("Failed to register user. Please try again.");
        }
      } catch (error) {
        console.error("Error registering user:", error);
        setMessage("Failed to register user.");
      }
    } else if (step === 3 && registerData.roles.rider) {
      // Step 3: Register Rider-specific data
      try {
        const riderInput = {
          user_id: registerData.user_id,
          vehicle_type: registerData.vehicleType,
          vehicle_registration_number: registerData.vehicleRegNumber,
          vehicle_insurance_number: registerData.vehicleInsuranceNumber,
          insurance_expiry_date: registerData.insuranceExpiryDate,
          driver_license_number: registerData.driverLicenseNumber,
          license_expiry_date: registerData.licenseExpiryDate,
          preferred_delivery_radius: registerData.preferredDeliveryRadius,
          preferred_working_days: registerData.preferredWorkingDays,
          preferred_start_time: registerData.preferredStartTime,
          preferred_end_time: registerData.preferredEndTime,
          long_distance_preference: registerData.longDistancePreference,
        };
  
        const { data } = await createRider({ variables: { input: riderInput } });
        console.log("Rider registered successfully:", data);
        if (data && data.createRider) {
          navigate("/home");
        } else {
          setMessage("Failed to register rider. Please try again.");
        }
      } catch (error) {
        console.error("Error registering rider:", error);
        setMessage("Failed to register rider.");
      }
    }else{
      //code for chef
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
                        value={registerData.firstName}
                      onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Last Name"
                        name="lastName"
                        placeholder="Enter your Last Name"
                        value={registerData.lastName}
                      onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Create a Password"
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                        value={registerData.password}
  onChange={handleChange}
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
                          value={registerData.gender}
                            onChange={handleChange}
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
                        value={registerData.email}
                            onChange={handleChange}

                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Mobile Number"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={registerData.mobile}
  onChange={handleChange}
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

                {step === 2 &&  (
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
                          value={registerData.address}
  onChange={handleChange}
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <InputField
                        label="Flat / House Number"
                        name="address2"
                        placeholder="Flat / House Number"
                        value={registerData.address2}
  onChange={handleChange}
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
                        value={registerData.province}
  onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Postal Code"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={registerData.postalCode}
  onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Country"
                        name="country"
                        placeholder="Country"
                        value={registerData.country}
  onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Nearby Landmark (optional)"
                        name="landmark"
                        placeholder="Nearby Landmark (optional)"
                        value={registerData.nearby_landmark}
  onChange={handleChange}
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
                        Proceed
                      </Button>
                    </Col>
                  </>
                )}

                {step === 3 && registerData.roles.rider && (
                  <>
                  <Col md={12}>
                    <h5>Vehicle Information</h5>
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Vehicle Type"
                      name="vehicleType"
                      placeholder="Select Vehicle Type"
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
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Vehicle Registration Number"
                      name="vehicleRegNumber"
                      placeholder="Vehicle Registration Number"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Vehicle Insurance Number"
                      name="vehicleInsuranceNumber"
                      placeholder="Vehicle Insurance Number"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Insurance Expiry Date"
                      type="date"
                      name="insuranceExpiryDate"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Driver's License Number"
                      name="driverLicenseNumber"
                      placeholder="Driver's License Number"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="License Expiry Date"
                      type="date"
                      name="licenseExpiryDate"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={12}>
                    <h5>Upload Driver License/Insurance</h5>
                    <InputField
                      label="Upload Driver License"
                      type="file"
                      name="document_upload_path"
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          document_upload_path: e.target.files[0],
                        })
                      }
                    />
                  </Col>

                  {/* Availability Section */}
                  <Col md={12}>
                    <h5>Availability</h5>
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Preferred Delivery Radius"
                      name="preferredDeliveryRadius"
                      placeholder="Select Radius"
                      as="select"
                      onChange={handleChange}
                    >
                      <option value="">Select Radius</option>
                      <option value="5 km">5 km</option>
                      <option value="10 km">10 km</option>
                      <option value="15 km">15 km</option>
                      <option value="20+ km">20+ km</option>
                    </InputField>
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Preferred Working Days"
                      name="preferredWorkingDays"
                      placeholder="Select Days"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Start Time"
                      name="preferredStartTime"
                      type="time"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="End Time"
                      name="preferredEndTime"
                      type="time"
                      onChange={handleChange}
                    />
                  </Col>


                  {/* Payment Information */}
                  <Col md={12}>
                    <h5>Payment Information</h5>
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Bank Account Number"
                      name="bankAccountNumber"
                      placeholder="Bank Account Number"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Transit Number"
                      name="transitNumber"
                      placeholder="Transit Number"
                      onChange={handleChange}
                    />
                  </Col>

                  {/* Profile Verification */}
                  <Col md={12}>
                    <h5>Profile Verification</h5>
                    <InputField
                      label="Upload Profile Picture"
                      type="file"
                      name="profilePicture"
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          profilePicture: e.target.files[0],
                        })
                      }
                    />
                  </Col>

                  {/* Submit Button */}
                  <Col md={12}>
                    <Button type="submit" className="btn-primary w-100">
                      Submit
                    </Button>
                  </Col>
                </>
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
