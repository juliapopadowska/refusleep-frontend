import React, { useContext } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import axios from "axios";
import UserProvider, { UserContext } from "./context/AuthContext";
import AddPlacePage from "./pages/AddPlace/AddPlacePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import DetailPage from "./pages/Detail/DetailPage";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }: any) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (user.email === "") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/addPlace"
          element={
            <ProtectedRoute>
              <AddPlacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addPlace/:id"
          element={
            <ProtectedRoute>
              <AddPlacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/apartment/:id" element={<DetailPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
