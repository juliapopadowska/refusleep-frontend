import React from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import axios from "axios";
import UserProvider from "./context/AuthContext";
import AddPlacePage from "./pages/AddPlace/AddPlacePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import DetailPage from "./pages/Detail/DetailPage";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/addPlace" element={<AddPlacePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/apartment/:id" element={<DetailPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
