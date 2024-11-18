import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';

const ProfileView = () => {
  const [userInfo, setUserInfo] = useState({});
  const [chefInfo, setChefInfo] = useState({});
  const [profileImageUrl, setProfileImageUrl] = useState(null);

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

  return (
    <>
    <Container>
      <Row>
        <Col>
          <Link className="btn-link  mb-3" to="/chef/orders">Dashboard</Link><span class="material-icons">
            arrow_forward
          </span><span>Profile Details</span>
        </Col>
        <Col md={12} className='mt-5'><h5>Profile Details</h5><hr /></Col>
      </Row>
      </Container>
     
      <Container>
 
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Profile</h2>
        <Link to="edit" className="btn-primary mb-3">Edit</Link>
      </div>

      {/* User Information */}
      <Row>
        <Col md={6}>
          <p><strong>First Name:</strong> {userInfo.first_name}</p>
          <p><strong>Last Name:</strong> {userInfo.last_name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Mobile Number:</strong> {userInfo.mobile_number}</p>
          <p><strong>Gender:</strong> {userInfo.gender}</p>
        </Col>
        <Col md={6}>
          <p><strong>Address Line 1:</strong> {userInfo.address_line_1}</p>
          <p><strong>Address Line 2:</strong> {userInfo.address_line_2}</p>
          <p><strong>City:</strong> {userInfo.city}</p>
          <p><strong>Province:</strong> {userInfo.province}</p>
          <p><strong>Postal Code:</strong> {userInfo.postal_code}</p>
          <p><strong>Country:</strong> {userInfo.country}</p>
          <p><strong>Nearby Landmark:</strong> {userInfo.nearby_landmark}</p>
        </Col>
      </Row>
      
      {profileImageUrl && (
        <Row className="mb-3">
          <Col>
            <img src={profileImageUrl} alt="Profile" className="img-fluid rounded" style={{ maxWidth: "150px" }} />
          </Col>
        </Row>
      )}

      {/* Chef Information */}
      {chefInfo && (
        <div>
          <h4>Chef Information</h4>
          <p><strong>Specialty Cuisines:</strong> {chefInfo.specialty_cuisines?.join(', ')}</p>
          <p><strong>Type of Meals:</strong> {chefInfo.type_of_meals?.join(', ')}</p>
          <p><strong>Cooking Experience:</strong> {chefInfo.cooking_experience}</p>
          <p><strong>Max Orders Per Day:</strong> {chefInfo.max_orders_per_day}</p>
          <p><strong>Preferred Working Days:</strong> {chefInfo.preferred_working_days?.join(', ')}</p>
        </div>
      )}
    
    </Container>
    </>
  );
};

export default ProfileView;
