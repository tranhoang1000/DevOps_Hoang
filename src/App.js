import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ImageSlider from "./components/ImageSlider";
import MovieDetail from "./pages/MovieDetail";
import MovieListPage from "./pages/MovieListPage";
import AuthForm from "./components/AuthForm";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import "./assets/styles.css";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("loggedInUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem("loggedInUser");
    }
  }, [loggedInUser]);

  return (
    <Router>
      <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imageSlider" element={<ImageSlider />} />
        <Route
          path="/authform"
          element={<AuthForm setLoggedInUser={setLoggedInUser} />}
        />
        <Route path="/movies" element={<MovieListPage />} />
        <Route path="/movies/:genre" element={<MovieListPage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/admin" element={<AdminPage loggedInUser={loggedInUser} />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
