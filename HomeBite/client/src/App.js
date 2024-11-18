import "./App.scss";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import ResetPassword from "./Pages/Login/ResetPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Register from './Pages/Register/Register';
import OrderCompleted from './Pages/Chef/OrderCompleted';
import CurrentOrders from "./Pages/Chef/CurrentOrders";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/chef/order-completed" element={<OrderCompleted />} />
      <Route path="*" element={<Navigate to="/chef/order-completed" />} />
      <Route path="/current-orders" element={<CurrentOrders />} />
    </Routes>
  );
}

export default App;
