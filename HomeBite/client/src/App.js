import "./App.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import ResetPassword from "./Pages/Login/ResetPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Register from './Pages/Register/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
