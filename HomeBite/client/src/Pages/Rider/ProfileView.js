import React, { useState, useEffect } from 'react';
import { Container, Row, Col,Alert } from "react-bootstrap";
import Button from "../../Components/Button/Button";
import { Link,useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

const ProfileView = () => {
  const [userInfo, setUserInfo] = useState({});
  const [RiderInfo, setRiderInfo] = useState({});
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const location = useLocation();
  const successMessage = location.state?.successMessage;  
  const navigate = useNavigate();

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
            getUserProfileRider {
              user {
                first_name last_name email mobile_number gender
                address_line_1 address_line_2 city province postal_code
                country nearby_landmark role profile_image
              }
              rider {
               vehicle_type vehicle_registration_number vehicle_insurance_number
                insurance_expiry_date driver_license_number license_expiry_date
                preferred_delivery_radius preferred_working_days preferred_start_time
                preferred_end_time long_distance_preference
              
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    const { user, rider } = data.data.getUserProfileRider;

    setUserInfo(user || {});
    setProfileImageUrl(user?.profile_image);
    setRiderInfo(rider || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Container fluid className="orders-page mt-3 bt-1">
      <Row>
          {successMessage && (
            <Col md={12}>
              <Alert variant="success" className="my-3">
                {successMessage}
              </Alert>
            </Col>
          )}
        </Row>
        <Row>
          <Col>
            <Link className="btn-link  mb-3" to="/rider/orders">Dashboard</Link><span className="material-icons">
              arrow_forward
            </span><span>Profile Details</span>
          </Col>
        </Row>
        <div className='row mt-5'>
          <div className='col-12 col-md-6 align-content-center'>
            <h5>Profile Details</h5>
          </div>
          <div className='col-12 col-md-6 text-start text-md-end '>
            <Button variant='secondary' className='small' onClick={() => navigate('/rider/profile/edit')} >Edit</Button>
          </div>
          <div className='col-12 pt-3'>
            <hr className="mt-0" />
          </div>
        </div>
      </Container>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body pt-0 pb-0'>
                <div className='row'>
                  <div className='col-md-4 text-center bg-light p-5'>
                    {profileImageUrl && (
                      <img src={profileImageUrl} alt="Profile" className="img-fluid profile-img" style={{ maxWidth: "150px" }} />
                    )}
                    <h5 class="mb-1 mt-3">{userInfo.first_name} {userInfo.last_name}</h5>
                  </div>
                  <div class="col-md-8 mt-md-4 pb-3">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="clearfix"></div>
                        <p class="mb-0 text-muted"><span class="material-icons me-2">email</span>{userInfo.email}</p>
                        <div class="clearfix"></div>
                        <p class="mb-0 text-muted mt-3"><span class="material-icons me-2">call</span>{userInfo.mobile_number}</p>
                        <div class="clearfix"></div>
                        <p class="mb-0 text-muted mt-3"><span class="material-icons me-2">wc</span>{userInfo.gender}</p>
                        <div class="clearfix"></div>
                        <div class="d-flex text-muted  mt-3">
                          <span class="material-icons me-2">map</span>
                          <div class="flex-grow-1">
                            <p class="mb-0 text-muted">{userInfo.address_line_1}</p>
                            <p class="mb-0 text-muted">{userInfo.address_line_2}</p>
                            <p class="mb-0 text-muted">{userInfo.city}</p>
                            <p class="mb-0 text-muted">{userInfo.province}, {userInfo.country} - {userInfo.postal_code}</p>
                            <p class="mb-0 text-muted mt-2">Nearby landmark - {userInfo.nearby_landmark}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 mt-5'>
            <div className='card'>
              <div className='card-body'>
                <h5 class="card-title">Rider Information</h5>
                <hr />
                <div className='row'>


                  {RiderInfo && (
                    <>
                      <div className='col-md-4'>
    <p><small>Vehicle Type</small><br /> {RiderInfo.vehicle_type}</p>
</div>
<div className='col-md-4'>
    <p><small>Vehicle Registration Number</small><br /> {RiderInfo.vehicle_registration_number}</p>
</div>
<div className='col-md-4'>
    <p><small>Vehicle Insurance Number</small><br /> {RiderInfo.vehicle_insurance_number}</p>
</div>
<div className='col-md-4'>
    <p><small>Insurance Expiry Date</small><br /> {RiderInfo.insurance_expiry_date}</p>
</div>
<div className='col-md-4'>
    <p><small>Driver License Number</small><br /> {RiderInfo.driver_license_number}</p>
</div>
<div className='col-md-4'>
    <p><small>License Expiry Date</small><br /> {RiderInfo.license_expiry_date}</p>
</div>
<div className='col-md-4'>
    <p><small>Preferred Delivery Radius</small><br /> {RiderInfo.preferred_delivery_radius}</p>
</div>
<div className='col-md-4'>
    <p><small>Preferred Working Days</small><br /> {RiderInfo.preferred_working_days?.join(', ')}</p>
</div>
<div className='col-md-4'>
    <p><small>Preferred Start Time</small><br /> {RiderInfo.preferred_start_time}</p>
</div>
<div className='col-md-4'>
    <p><small>Preferred End Time</small><br /> {RiderInfo.preferred_end_time}</p>
</div>
<div className='col-md-4'>
    <p><small>Long Distance Preference</small><br /> {RiderInfo.long_distance_preference}</p>
</div>

                    </>
                  )}


                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default ProfileView;
