import logo from "./logo2.png";
import chatBtn from "./chat-button2.png";
import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Query from "./pages/Query2";

import FallingCube from "./FallingCube";
import ButtonCube from "./ButtonCube";
import Blocks from "./pages/Blocks";
import Chat from "./pages/Chat";
import Transactions from "./pages/Transactions";

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

  return (
    <div className="App">
      <header className="App-header">
        <div id="header-logo">
          <Link to="/" id="logo">
            <img id="logo" src={logo}></img>
          </Link>
        </div>
        <div id="header-search">
          <form onSubmit={handleQuerySubmit}>
            <input
              id="search-box"
              placeholder="Search by address / txn hash / block / token..."
              value={query}
              onChange={handleQueryChange}
            />{" "}
          </form>
        </div>

        <div id="header-button">
          <Link to="/Chat">
            <img id="chatBtn" src={chatBtn}></img>
          </Link>
          <div id="cube-button-container">
            <button
              onClick={toggleAnimation}
              className="cube-button"
              style={{ width: "100px", height: "100px" }}
            >
              <ButtonCube isAnimating={isAnimating} style={cubeStyle} />
            </button>
          </div>
        </div>
      </header>
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
        </Routes>
      </div>

      <footer className="App-footer">
        <a>Contact Us</a>
        <a>Terms of Service</a>
        <a>Privacy Policy</a>
        <a>Disclaimer</a>
        <a>© 2023 The Node Project</a>
        {/*<form></form>*/}
      </footer>
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
