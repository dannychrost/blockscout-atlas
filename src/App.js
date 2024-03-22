import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Query from "./pages/Query2";
import CubesPage from "./pages/CubesPage";

import FallingCube from "./FallingCube";

import Blocks from "./pages/Blocks";
import Chat from "./pages/Chat";
import Transactions from "./pages/Transactions";

import { useMediaQuery } from "react-responsive";
function App() {
  const [ethPrice, setEthPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);
  const toggleAnimation = () => setIsAnimating(!isAnimating);

  useEffect(() => {
    const url = "https://eth.blockscout.com/api/v2/main-page/transactions";

    fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the first transaction has the latest Ethereum price
        const price = data[0].exchange_rate;
        setEthPrice(price);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Create stars
    const starsContainer = document.createElement("div");
    starsContainer.classList.add("stars-container");

    for (let i = 0; i < 100; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      // Assign a random animation delay between 0 and 5 seconds
      const animationDelay = Math.random() * 5;
      star.style.animationDelay = `${animationDelay}s`;

      starsContainer.appendChild(star);
    }

    document.body.prepend(starsContainer); // prepend to keep z-index order
    return () => {
      document.body.removeChild(starsContainer);
    };
  }, []);

  //if (loading) return <div>Loading...</div>;
  //if (error) return <div>Error: {error}</div>;

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    navigate(`/Query/${query}`); // Use URL parameter for navigation
  };

  const cubeStyle = {
    height: "50%", // Cube will take full height of the button
    width: "50%", // Cube will take full width of the button
  };
  const isLargeScreen = useMediaQuery({ minWidth: 992 });
  return (
    <div className="App">
      <Header
        {...{
          toggleAnimation,
          query,
          handleQueryChange,
          handleQuerySubmit,
          isAnimating,
        }}
      />
      <div id="cubes">
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />

        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
        <FallingCube isAnimating={isAnimating} />
      </div>
      <div id="routes-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Query/:searchTerm" element={<Query />} />
          <Route path="/Blocks" element={<Blocks />} />
          <Route path="/Transactions" element={<Transactions />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/CubesPage" element={<CubesPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;
