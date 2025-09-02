import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Router,
} from "react-router-dom";
import UserLogin from "./pages/user/UserLogin";
import UserForgotPassword from "./pages/user/UserForgotPassword";
import ProvLogin from "./pages/provider/ProvLogin";
import ProvForgotPassword from "./pages/provider/ProvForgotPassword";
import Home from "./pages/Home";
import ProvHome from "./pages/provider/ProvHome";
import UserDashboard from "./pages/user/UserDashboard";
import About from "./pages/about";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-forgot-password" element={<UserForgotPassword />} />
      <Route path="/prov-login" element={<ProvLogin />} />
      <Route path="/prov-forgot-password" element={<ProvForgotPassword />} />
      <Route path="/prov-home" element={<ProvHome />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
