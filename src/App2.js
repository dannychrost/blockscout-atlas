import logo from "./tnp logo.png";
import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import Query from "./pages/Query";

function App() {
  /*
  const location = useLocation();
  const [ethPrice, setEthPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const url = "https://eth.blockscout.com/api/v2/main-page/transactions";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    // Redirect to the Query page with the address as state
    navigate("/Query", { state: { query } });
  };
*/
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/" id="logo">
          <h1 id="logo" href="">
            TNP
          </h1>
        </Link>
        <form onSubmit={handleQuerySubmit}>
          <input
            id="search-box"
            placeholder="Search by address / txn hash / block / token..."
            value={query}
            onChange={handleQueryChange}
          />{" "}
        </form>
        <div>
          <p>ETH: ${ethPrice}</p>
        </div>
      </header>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/Query" element={<Query />} />
      </Routes>
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
/*}
function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;*/
