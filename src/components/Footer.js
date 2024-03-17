import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center">
        <div className="flex flex-col md:flex-row items-center">
          <Link
            to="/contact-us"
            className="text-white px-4 py-2 hover:text-gray-300"
          >
            Contact Us
          </Link>
          <Link
            to="/terms-of-service"
            className="text-white px-4 py-2 hover:text-gray-300"
          >
            Terms of Service
          </Link>
        </div>
        <div className="text-center md:text-right mt-4 md:mt-0">
          © 2024 NYCNode
        </div>
      </div>
    </footer>
  );
};

export default Footer;
