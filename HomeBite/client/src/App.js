
import { Route, Routes } from "react-router-dom";
//import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import ResetPassword from "./Pages/Login/ResetPassword";
import Dashboard from "./Pages/Customer/Dashboard";
import Register from './Pages/Register/Register';
import ChefDash from "./Pages/Chef/Dashboard";
import Products from "./Pages/Chef/Product/Products";
import AddProduct from "./Pages/Chef/Product/AddProduct";
import EditProduct from "./Pages/Chef/Product/EditProduct";
import CurrentOrders from "./Pages/Chef/CurrentOrders";
import CompletedOrders from "./Pages/Chef/OrderCompleted";
import Profile from "./Pages/Chef/ProfileView";
import EditProfile from "./Pages/Chef/Profile";

import RiderOrderCompleted from './Pages/Rider/RiderOrderCompleted';

import "./App.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* <Route path="/Home" element={<Home />} /> */}
      <Route path="/Login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
       {/* Chef routes */}
       {/* Chef Dashboard Layout with Nested Routes */}
      <Route path="/chef" element={<ChefDash />}>
        {/* <Route index element={<Dashboard />} /> This could be the main dashboard view */}
        <Route path="orders" element={<CurrentOrders />} />
        <Route path="orders/completed" element={<CompletedOrders />} />
        <Route path="products" element={<Products />} />
        <Route path="product/add" element={<AddProduct />} />
        <Route path="product/edit/:id" element={<EditProduct />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
      </Route>
      {/* Rider routes */}
<     Route path="/rider/orders/completed" element={<RiderOrderCompleted />} />
      

      
    </Routes>
  );
}

export default App;
