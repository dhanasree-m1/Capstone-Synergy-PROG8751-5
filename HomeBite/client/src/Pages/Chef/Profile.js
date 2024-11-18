import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
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

    // Ensure max_orders_per_day is parsed as an integer
    const chefData = {
      ...chefInfo,
      max_orders_per_day: parseInt(chefInfo.max_orders_per_day, 10) || 0,
    };

    console.log("User input for mutation:", userInfo);
    console.log("Chef input for mutation:", chefData);

    try {
        const result = await updateUserProfile({
          variables: {
            id: localStorage.getItem("user_id"),
            userInput: {
              first_name: userInfo.first_name,
              last_name: userInfo.last_name,
              email: userInfo.email,
              mobile_number: userInfo.mobile_number,
              role:userInfo.role[0],
              gender: userInfo.gender,
              profile_image: profileImageUrl,
              address_line_1: userInfo.address_line_1,
              address_line_2: userInfo.address_line_2,
              city: userInfo.city,
              province: userInfo.province,
              postal_code: userInfo.postal_code,
              country: userInfo.country,
              nearby_landmark: userInfo.nearby_landmark,
             
              password_hash: userInfo.password_hash,
            },
            chefInput: {
              specialty_cuisines: chefInfo.specialty_cuisines,
              type_of_meals: chefInfo.type_of_meals,
              cooking_experience: chefInfo.cooking_experience,
              max_orders_per_day: parseInt(chefInfo.max_orders_per_day, 10),
              preferred_working_days: chefInfo.preferred_working_days,
            },
          },
        });
      
        console.log("Mutation result:", result);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile.");
      }
      
  };

  return (
    <Container>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* User Information */}
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
          <Col md={6}>
            <InputField label="Address Line 1" name="address_line_1" value={userInfo.address_line_1 || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Address Line 2" name="address_line_2" value={userInfo.address_line_2 || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="City" name="city" value={userInfo.city || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Province" name="province" value={userInfo.province || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Postal Code" name="postal_code" value={userInfo.postal_code || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Country" name="country" value={userInfo.country || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            <InputField label="Nearby Landmark" name="nearby_landmark" value={userInfo.nearby_landmark || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
          </Col>
        </Row>
        <ImageUpload label="Profile Image" currentImageUrl={profileImageUrl} onImageUpload={handleProfileImageUpload} />

        {/* Chef Information */}
        <div>
          <h4>Chef Information</h4>
          <SpecialtyCuisinesOptions cuisines={chefInfo.specialty_cuisines} onCuisineChange={handleCuisineChange} />
          <TypeOfMealsOptions meals={chefInfo.type_of_meals} onMealChange={handleMealChange} />
          <InputField label="Cooking Experience" name="cooking_experience" value={chefInfo.cooking_experience || ''} onChange={(e) => handleInputChange(e, setChefInfo)} />
          <InputField label="Max Orders Per Day" name="max_orders_per_day" value={chefInfo.max_orders_per_day || ''} onChange={(e) => handleInputChange(e, setChefInfo)} />
          <AvailabilityOptions selectedDays={chefInfo.preferred_working_days} onDayChange={handleWorkingDaysChange} />
        </div>

        {/* Password Change */}
        <InputField label="New Password" name="password" type="password" placeholder="Enter new password" value={userInfo.password || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />

        <Button className="btn-primary mb-3" type="submit">Save Changes</Button>
      </form>
    </Container>
  );
};

export default Profile;
