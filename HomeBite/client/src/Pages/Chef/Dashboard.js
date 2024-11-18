import React from 'react';
import { Link, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from '../../Components/Header/Header';
import "./chef.scss";



const Dashboard = () => {
  return (
    <Container fluid  >
    <Header/>
      <aside className="sidebar">
        {/* <div className="logo">HomeBite</div> */}
        <nav>
          <ul>
            <li><Link to="">Dashboard</Link></li>
            <li><Link to="orders">Orders</Link></li>
            <li><Link to="products">Foods</Link></li>
            <li><Link to="profile">Profile</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h2>Hello {localStorage.getItem('uname')},</h2>
        <Outlet /> {/* This will render the selected page */}
      </main>
    
    </Container>
  );
};

export default Dashboard;

