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
import { useMutation } from "@apollo/client";
import { CREATE_USER, CREATE_RIDER } from "../../queries";

const Register = () => {
  const [step, setStep] = useState(1);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword:"",
    mobile: "",
    address: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    gender: "Other",
    roles: {
      customer: false,
      chef: false,
      rider: false,
    },
    nearby_landmark: "",
    // Rider-specific fields
    vehicleType: "",
    vehicleRegNumber: "",
    vehicleInsuranceNumber: "",
    insuranceExpiryDate: "",
    driverLicenseNumber: "",
    licenseExpiryDate: "",
    document_upload_path: "",
    preferredDeliveryRadius: "",
    preferredWorkingDays: [],
    preferredStartTime: "",
    preferredEndTime: "",
    longDistancePreference: false,
    // Chef-specific fields (you can add specific chef fields if necessary)
    profilePicture: null,
    // Payment information
    bankAccountNumber: "",
    transitNumber: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [createUser] = useMutation(CREATE_USER);
  const [createRider] = useMutation(CREATE_RIDER);
  //const [createChef] = useMutation(CREATE_CHEF);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setMessage("");
  };
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setRegisterData((prevData) => {
      const updatedDays = checked
        ? [...prevData.preferredWorkingDays, value]
        : prevData.preferredWorkingDays.filter((day) => day !== value);
      return { ...prevData, preferredWorkingDays: updatedDays };
    });
  };
  const workingDaysOptions = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];
 // Validation helper functions
 const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
 const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
 const validatePostalCode = (postalCode) => /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(postalCode); // Canadian format
 const validateFutureDate = (date) => new Date(date) >= new Date();

 const validateStep1 = () => {
    const { firstName, lastName, email, password, confirmPassword, roles } = registerData;
    let isValid = true;
  
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setMessage("Please fill in all required fields.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      isValid = false;
    } else if (!roles.customer && !roles.chef && !roles.rider) {
      setMessage("Please select at least one role.");
      isValid = false;
    }
  
    return isValid;
  };
  const validateStep2 = () => {
    const { address, address2, city, province, postalCode, country } = registerData;
    let isValid = true;
  
    // Validate each field and set message accordingly if missing
    if (!address.trim()) {
      setMessage("Address is required.");
      isValid = false;
    } else if (!city.trim()) {
      setMessage("City is required.");
      isValid = false;
    } else if (!province.trim()) {
      setMessage("Province is required.");
      isValid = false;
    } else if (!country.trim()) {
      setMessage("Country is required.");
      isValid = false;
    } else if (!postalCode.trim()) {
      setMessage("Postal code is required.");
      isValid = false;
    } else if (!/^([a-zA-Z]\d[a-zA-z]( )?\d[a-zA-Z]\d)$/.test(postalCode)) { // Adjust regex as needed for postal code format
      setMessage("Please enter a valid postal code.");
      isValid = false;
    } else {
      setMessage(""); // Clear message if all validations pass
    }
  
    return isValid;
  };
  const validateRider = () => {
    const {
      vehicleType,
      vehicleRegNumber,
      driverLicenseNumber,
      preferredDeliveryRadius,
      preferredWorkingDays,
      preferredStartTime,
      preferredEndTime,
      insuranceExpiryDate,
      licenseExpiryDate,
    } = registerData;

    if (
      !vehicleType ||
      !vehicleRegNumber ||
      !driverLicenseNumber ||
      !preferredDeliveryRadius ||
      preferredWorkingDays.length === 0 ||
      !preferredStartTime ||
      !preferredEndTime
    ) {
      setMessage("Please fill in all required fields for Rider.");
      return false;
    }

    if (insuranceExpiryDate && !validateFutureDate(insuranceExpiryDate)) {
      setMessage("Insurance expiry date cannot be in the past.");
      return false;
    }

    if (licenseExpiryDate && !validateFutureDate(licenseExpiryDate)) {
      setMessage("License expiry date cannot be in the past.");
      return false;
    }

    return true;
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
    setMessage("");
  };

  const createUserAccount = async () => {
    const userInput = {
        first_name: registerData.firstName || "",
        last_name: registerData.lastName || "",
        email: registerData.email || "",
        mobile_number: registerData.mobile || "",
        password_hash: registerData.password || "",
      role: "customer",
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
    console.log("User input for mutation:", userInput);
    const { data } = await createUser({ variables: { input: userInput } });
    if (data && data.createUser) {
        
     
      console.log("User ID for Rider:", data.createUser.id);
      console.log("User created successfully!!")
      return data.createUser.id;
    } else {
      setMessage("Failed to register user. Please try again.");
    }
    return null
  };

  const createRiderAccount = async (userId) => {
    
    try {
    if (!userId) {
      setMessage("User ID is missing. Rider cannot be created.");
      console.error("User ID missing for Rider creation");
      return;
    }
    const riderInput = {
        user_id:userId, // Ensure user_id is set
        vehicle_type: registerData.vehicleType || "",
        vehicle_registration_number: registerData.vehicleRegNumber || "",
        vehicle_insurance_number: registerData.vehicleInsuranceNumber || "",
        insurance_expiry_date: registerData.insuranceExpiryDate || "",
        driver_license_number: registerData.driverLicenseNumber || "",
        license_expiry_date: registerData.licenseExpiryDate || "",
        preferred_delivery_radius: registerData.preferredDeliveryRadius || "",
        preferred_working_days: registerData.preferredWorkingDays || [],
        preferred_start_time: registerData.preferredStartTime || "",
        preferred_end_time: registerData.preferredEndTime || "",
        long_distance_preference: registerData.longDistancePreference || false,
    };
    console.log("Rider input for mutation:", riderInput);
    const { data } = await createRider({ variables: { input: riderInput } });
    if (!data || !data.createRider) {
      setMessage("Failed to register rider. Please try again.");
    } else {
      console.log("Rider created successfully!");
    }
} catch (error) {
    console.error("Error creating rider:", error);
    setMessage("Failed to register rider.");
  }
  };

  const createChefAccount = async () => {
    const chefInput = {
      user_id: registerData.user_id,
      // Add any additional chef-specific fields here
    };
  //  const { data } = await createChef({ variables: { input: chefInput } });
   // if (!data || !data.createChef) {
   //   setMessage("Failed to register chef. Please try again.");
   // }
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { customer, chef, rider } = registerData.roles;
    
    
//     if (step === 1) {
   
//     if (validateStep1()) {
//         setMessage(""); 
//       setStep(customer || chef ? 2 : 3);
//      } // Skip to step 3 if only Rider is selected
//     } else if (step === 2) {
//       // Create User Account
//       //if (customer && !validateCustomer()) return;
//       if (validateStep2()) {
//         setMessage("");
//         await handleFormSubmission()
//       //await createUserAccount();
//       }

      
      
//     } else if (step === 3) {
//       // Register Rider-specific information
      
//     }
//   };
// const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { customer, chef, rider } = registerData.roles;

//     // Step 1 Validation and Navigation
//     if (step === 1) {
//         console.log("step1")
//         if (validateStep1()) {
//             // Move to step based on roles
//             if (customer || chef) {
//                 console.log("step11")
//                 setStep(2); // Move to address step for customer/chef
//             } else if (rider) {
//                 console.log("step111")
//                 setStep(3); // Skip to rider step if only rider is selected
//             }
//         }
//         return;
//     }

//     // Step 2: Address Information
//     if (step === 2) {
//         console.log("step2")
//         if (validateStep2()) {
//             console.log("step22")
//             // Navigate based on role selection
//             if (rider) {
//                 console.log("step222")
//                 setStep(3); // Proceed to Rider details if rider role is selected
//             } else {
//                 console.log("step2222")
//                 await handleFormSubmission(); // No rider role, so submit after address
//             }
//         }
//         return;
//     }

//     // Step 3: Rider-Specific Information
//     if (step === 3) {
//         console.log("step3")
//         if (validateRider()) {
//             console.log("step33")
//             await handleFormSubmission(); // Submit for rider after validation
//         }
//     }
//     setMessage("User registered successfully!!.");
// };
const handleSubmit = async (e) => {
    e.preventDefault();
    const { customer, chef, rider } = registerData.roles;

    if (step === 1) {
      if (validateStep1()) {
        setStep(customer || chef ? 2 : 3);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        if (rider) {
          setStep(3);
        } else {
          await handleFormSubmission();
        }
      }
    } else if (step === 3) {
      if (validateRider()) {
        await handleFormSubmission();
      }
    }
  };

const handleFormSubmission = async () => {
    try {
        // Create User Account and get userId
        const userId = await createUserAccount();
        console.log("userid:"+userId)
        if (userId) {
            setRegisterData((prevData) => ({ ...prevData, user_id: userId }));
            const { rider, chef } = registerData.roles;
            
            // Create additional accounts based on roles
            if (rider) await createRiderAccount(userId);
            if (chef) await createChefAccount(userId);

            // Navigate to home or success page after all steps complete
            navigate("/");
        }
    } catch (error) {
        console.error("Error in form submission:", error);
        setMessage("Failed to register. Please try again.");
    }
};
  const selectedRolesCount = Object.values(registerData.roles).filter(Boolean).length;

  return (
    <Container fluid>
      <Row>
        <Col md={7} className="p-0">
          <div className="login-container">
            <div className="login-box">
              <img src={Logo} className="logo" alt="Logo" />
              {step === 1 && (
                <>
                  <h2 className="form-title mt-5 mb-2">Get Started with HomeBite</h2>
                  <p className="mb-4">Enjoy the best home-cooked meals delivered to your doorstep.</p>
                </>
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
                        name="confirmPassword"
                        placeholder="Re-enter your password to confirm"
                        value={registerData.confirmPassword}
    onChange={handleChange}
                      />
                    </Col>
                    <Col md={12}>
                      <h5 className="form-sub-title">Select your Gender</h5>
                      <div className="gender-options">
  <RadioButton
    label="Male"
    name="gender"
    value="male"
    checked={registerData.gender === "male"}
    onChange={handleChange}
  />
  <RadioButton
    label="Female"
    name="gender"
    value="female"
    checked={registerData.gender === "female"}
    onChange={handleChange}
  />
  <RadioButton
    label="Other"
    name="gender"
    value="other"
    checked={registerData.gender === "other"}
    onChange={handleChange}
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
                      <RoleOptions roles={registerData.roles} onRoleChange={handleRoleChange} />
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
                      <h2 className="form-title">Additional Information</h2>
                      <hr />
                      <h3>Step 1 of {selectedRolesCount}</h3>
                      <h4 className="form-sub-title">
                        For {selectedRolesCount > 1 ? "Multiple Roles" : "Customer"}
                      </h4>
                      <InputField
                        label="Address"
                        name="address"
                        placeholder="Start Typing Your Address"
                        value={registerData.address}
                        onChange={handleChange}
                      />
                    </Col>
                    {/* Add more fields for address, rider, and chef specifics here */}
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
                      <InputField label="City" name="city" placeholder="City" value={registerData.city}
  onChange={handleChange} />
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
                      <Button type="submit" className="btn-primary w-100 mt-3">
                        Submit
                      </Button>
                    </Col>
                  </>
                )}{step === 3 && registerData.roles.rider && (
                    <>
                    <Col md={12}>
                      <h5>Vehicle Information</h5>
                    </Col>
                    <Col md={6}>
  <InputField
    label="Vehicle Type"
    name="vehicleType"
    type="select" // Assuming InputField can handle a select type
    value={registerData.vehicleType}
    onChange={handleChange}
    options={[
      { value: "", label: "Select Vehicle Type" },
      { value: "Bike", label: "Bike" },
      { value: "Scooter", label: "Scooter" },
      { value: "Motorcycle", label: "Motorcycle" },
      { value: "Car", label: "Car" },
      { value: "Other", label: "Other" },
    ]}
  />
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
                    <Col md={12}>
                      <div className="mb-3">
                        <label>Preferred Working Days</label>
                        <div className="d-flex flex-wrap">
                          {workingDaysOptions.map((option) => (
                            <Checkbox
                              key={option.value}
                              label={option.label}
                              name="preferredWorkingDays"
                              value={option.value}
                              checked={registerData.preferredWorkingDays.includes(option.value)}
                              onChange={handleCheckboxChange}
                            />
                          ))}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
  <InputField
    label="Preferred Delivery Radius"
    name="preferredDeliveryRadius"
    type="select"
    value={registerData.preferredDeliveryRadius}
    onChange={handleChange}
    options={[
      { value: "", label: "Select Radius" },
      { value: "5 km", label: "5 km" },
      { value: "10 km", label: "10 km" },
      { value: "15 km", label: "15 km" },
      { value: "20+ km", label: "20+ km" },
    ]}
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
