import React from "react";
import { Link } from "react-router-dom";
import { Bot, Box, Boxes } from "lucide-react";
import { Input } from "@/components/ui/input";
import logo from "../images/logoApngCentered&Enlarged.png"; // Update the path as needed

const Header = ({
  toggleAnimation,
  query,
  handleQueryChange,
  handleQuerySubmit,
}) => {
  return (
    <header className="dark p-4 shadow-md">
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-28 mr-4" />
        </Link>

        <form onSubmit={handleQuerySubmit} className="flex-1 mx-4">
          <Input
            className="w-full p-3 border border-gray-300 rounded-lg text-white bg-transparent"
            placeholder="Search by address / txn hash / block / token..."
            value={query}
            onChange={handleQueryChange}
          />
        </form>

        <div className="flex items-center space-x-4">
          <Link to="/Chat" className="text-white hover:text-gray-200">
            <Bot size={32} />
          </Link>
          <button
            onClick={toggleAnimation}
            className="text-white hover:text-gray-200"
          >
            <Boxes size={32} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
