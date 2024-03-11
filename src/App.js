import logo from "./logo4.png";
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
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
      <header>
        {isLargeScreen ? (
          <Navbar expand={false} bg="light" variant="light">
            <Container>
              <Navbar.Brand href="#home">
                <div id="header-logo">
                  <Link to="/">
                    <img id="logo" src={logo}></img>
                  </Link>
                </div>
              </Navbar.Brand>
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
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                id="basic-navbar-nav"
                className="fullscreen-collapse"
              >
                <Nav className="me-auto">
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
                        <ButtonCube
                          isAnimating={isAnimating}
                          style={cubeStyle}
                        />
                      </button>
                    </div>
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        ) : (
          <Navbar expand={false} bg="light" variant="light">
            <Container>
              <Navbar.Brand href="#home">
                <div id="header-logo">
                  <Link to="/">
                    <img id="logo" src={logo}></img>
                  </Link>
                </div>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
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
                        <ButtonCube
                          isAnimating={isAnimating}
                          style={cubeStyle}
                        />
                      </button>
                    </div>
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )}
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
        <Navbar
          fixed="bottom"
          bg="light"
          variant="light"
          className="App-footer"
        >
          <Container>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/contact-us">
                Contact Us
              </Nav.Link>
              <Nav.Link as={Link} to="/terms-of-service">
                Terms of Service
              </Nav.Link>
              {/* ... more links */}
            </Nav>
            <Navbar.Text className="text-center">
              © 2023 The Node Project
            </Navbar.Text>
          </Container>
        </Navbar>
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
