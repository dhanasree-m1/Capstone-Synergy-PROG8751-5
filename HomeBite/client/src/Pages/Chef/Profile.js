import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from "react-bootstrap";
import InputField from '../../Components/InputField/InputField';
import ImageUpload from '../../Components/ImageUpload/ImageUpload';
import Button from "../../Components/Button/Button";
import RadioButton from "../../Components/RadioButton/RadioButton";
import SpecialtyCuisinesOptions from "../../Components/SpecialtyCuisinesOptions/SpecialtyCuisinesOptions";
import TypeOfMealsOptions from "../../Components/TypeOfMealsOptions/TypeOfMealsOptions";
import AvailabilityOptions from "../../Components/AvailabilityOptions/AvailabilityOptions";
import { UPDATE_USER_PROFILES } from "../../queries";
import { useMutation } from "@apollo/client";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    gender: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    nearby_landmark: '',
    profile_image: '',
    password_hash: '',
  });

  const [chefInfo, setChefInfo] = useState({
    specialty_cuisines: [],
    type_of_meals: [],
    cooking_experience: '',
    max_orders_per_day: '',
    preferred_working_days: [],
  });

  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [message, setMessage] = useState(""); // State to store feedback messages
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILES);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            getUserProfile {
              user {
                first_name last_name email mobile_number gender
                address_line_1 address_line_2 city province postal_code
                country nearby_landmark role profile_image
              }
              chef {
                specialty_cuisines type_of_meals cooking_experience
                max_orders_per_day preferred_working_days
              }
            }
          }
        `,
      }),
    });
    
    const data = await response.json();
    const { user, chef } = data.data.getUserProfile;

    setUserInfo(user || {});
    setProfileImageUrl(user?.profile_image);
    setChefInfo(chef || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateInputs = () => {
    const errors = [];
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^(?!.*\.\.)(?!.*@.*@)(?!.*\s)(?!.*[,'`])([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.(com|org|net|gov|edu|mil|info|biz|name|us|uk|ca|au|in|de|fr|cn|jp|br|ru|za|mx|nl|es|it|app|blog|shop|online|site|tech|io|ai|co|xyz|photography|travel|museum|jobs|health)$/;
    const phoneRegex = /^[0-9]{10}$/;
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;

    if (!userInfo.first_name || !nameRegex.test(userInfo.first_name)) {
      errors.push("First name is required and must contain only letters.");
    }
    if (!userInfo.last_name || !nameRegex.test(userInfo.last_name)) {
      errors.push("Last name is required and must contain only letters.");
    }
    if (!userInfo.email || !emailRegex.test(userInfo.email)) {
      errors.push("A valid email address is required.");
    }
    if (!userInfo.mobile_number || !phoneRegex.test(userInfo.mobile_number)) {
      errors.push("A valid 10-digit mobile number is required.");
    }
    if (userInfo.postal_code && !postalCodeRegex.test(userInfo.postal_code)) {
      errors.push("Postal code can only contain letters, numbers, and dashes.");
    }
    if (!chefInfo.cooking_experience) {
      errors.push("Cooking experience is required for chefs.");
    }

    if (errors.length > 0) {
      setMessage(errors.join(" "));
      return false;
    }
    return true;
  };

  const handleInputChange = (e, stateSetter) => {
    const { name, value, type, checked } = e.target;
    stateSetter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProfileImageUpload = (imageUrl) => {
    setProfileImageUrl(imageUrl);
  };

  const handleCuisineChange = (e) => {
    const { value, checked } = e.target;
    setChefInfo((prev) => ({
      ...prev,
      specialty_cuisines: checked
        ? [...prev.specialty_cuisines, value]
        : prev.specialty_cuisines.filter((cuisine) => cuisine !== value),
    }));
  };

  const handleWorkingDaysChange = (e) => {
    const { value, checked } = e.target;
    setChefInfo((prev) => {
      const updatedDays = checked
        ? [...prev.preferred_working_days, value]
        : prev.preferred_working_days.filter((day) => day !== value);
      return { ...prev, preferred_working_days: updatedDays };
    });
  };

  const handleMealChange = (e) => {
    const { value, checked } = e.target;
    setChefInfo((prev) => ({
      ...prev,
      type_of_meals: checked
        ? [...prev.type_of_meals, value]
        : prev.type_of_meals.filter((meal) => meal !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const chefData = {
      ...chefInfo,
      max_orders_per_day: parseInt(chefInfo.max_orders_per_day, 10) || 0,
    };

    try {
      const result = await updateUserProfile({
        variables: {
          id: localStorage.getItem("user_id"),
          userInput: {
            ...userInfo,
            profile_image: profileImageUrl,
            //role: userInfo.role ? userInfo.role[0] : undefined,
          },
          chefInput: chefData,
        },
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile. Please try again.");
    }
  };

  return (
    <Container>
      <h2>Profile</h2>
      {message && (
        // <Alert variant={message.includes("Error") ? "danger" : "success"}>
        <Alert variant= "danger" >
          {message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <InputField label="First Name" name="first_name" value={userInfo.first_name || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Last Name" name="last_name" value={userInfo.last_name || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Email" name="email" value={userInfo.email || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Mobile Number" name="mobile_number" value={userInfo.mobile_number || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <h5 className="form-sub-title">Select your Gender</h5>
            <div className="gender-options mb-3">
              <RadioButton label="Male" name="gender" value="Male" checked={userInfo.gender === "Male"} onChange={(e) => handleInputChange(e, setUserInfo)} />
              <RadioButton label="Female" name="gender" value="Female" checked={userInfo.gender === "Female"} onChange={(e) => handleInputChange(e, setUserInfo)} />
              <RadioButton label="Other" name="gender" value="Other" checked={userInfo.gender === "Other"} onChange={(e) => handleInputChange(e, setUserInfo)} />
            </div>
          </Col>
          {/* <Col md={6}>
            <InputField label="Address Line 1" name="address_line_1" value={userInfo.address_line_1 || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Address Line 2" name="address_line_2" value={userInfo.address_line_2 || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="City" name="city" value={userInfo.city || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Province" name="province" value={userInfo.province || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Postal Code" name="postal_code" value={userInfo.postal_code || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Country" name="country" value={userInfo.country || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Nearby Landmark" name="nearby_landmark" value={userInfo.nearby_landmark || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
          </Col> */}
        </Row>
        <ImageUpload label="Profile Image" currentImageUrl={profileImageUrl} onImageUpload={handleProfileImageUpload} />
        <div>
          <h4>Chef Information</h4>
          <SpecialtyCuisinesOptions cuisines={chefInfo.specialty_cuisines} onCuisineChange={handleCuisineChange} />
          <TypeOfMealsOptions meals={chefInfo.type_of_meals} onMealChange={handleMealChange} />
          <InputField label="Cooking Experience" name="cooking_experience" value={chefInfo.cooking_experience || ''} onChange={(e) => handleInputChange(e, setChefInfo)} />
          <InputField label="Max Orders Per Day" name="max_orders_per_day" value={chefInfo.max_orders_per_day || ''} onChange={(e) => handleInputChange(e, setChefInfo)} />
          <AvailabilityOptions selectedDays={chefInfo.preferred_working_days} onDayChange={handleWorkingDaysChange} />
        </div>
        <InputField label="New Password" name="password" type="password" placeholder="Enter new password" value={userInfo.password || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
        <Button className="btn-primary mb-3" type="submit">Save Changes</Button>
      </form>
    </Container>
  );
};

export default Profile;
