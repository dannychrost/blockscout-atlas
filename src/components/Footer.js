import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = ({ theme }) => {
  // Determine the theme class based on the theme prop
  const themeClass = theme === "light" ? "footerLight" : "footerDark";

  return (
    <footer className={`p-4 ${themeClass}`}>
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center">
        <div className={`${themeClass} flex flex-col md:flex-row items-center`}>
          <Link to="/contact-us" className="px-4 py-2 hover:text-gray-300">
            Contact Us
          </Link>
          <Link
            to="/terms-of-service"
            className="px-4 py-2 hover:text-gray-300"
          >
            Terms of Service
          </Link>
        </div>
        <div className={`${themeClass} text-center md:text-right mt-4 md:mt-0`}>
          © 2024 NYCNode
        </div>
      </div>
    </footer>
  );
};

export default Footer;
