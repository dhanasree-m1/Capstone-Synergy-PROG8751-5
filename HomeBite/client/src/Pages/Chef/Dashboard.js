import React from 'react';
import { Link, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from '../../Components/Header/Header';
import "./chef.scss";



const Dashboard = () => {
  return (
    <>
      <Container fluid className='p-0' >
        <Header />
      </Container>
      <Container fluid >
        <div className='row'>
          <div className="col-2 sidebar">
            {/* <div className="logo">HomeBite</div> */}
            <nav>
              <ul>
                <li><Link to="orders" className='btn-link'><span class="material-icons">home</span>Dashboard</Link></li>
                <li><Link to="products" className='btn-link'><span class="material-icons">coffee</span>Menu</Link></li>
                <li><Link to="profile" className='btn-link'><span class="material-icons">person</span>Profile Details</Link></li>
              </ul>
            </nav>
          </div>
          <div className="col-10 content">
            

            <Outlet /> {/* This will render the selected page */}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;

