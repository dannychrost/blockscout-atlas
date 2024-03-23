import React from "react";
import { Link } from "react-router-dom";
import { Bot, Box, Boxes, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import logoB1 from "../images/logoBBlackText.png";
import logoB2 from "../images/logoBWhiteText.png";
import "../styles/Header.css";
const Header = ({
  toggleAnimation,
  query,
  handleQueryChange,
  handleQuerySubmit,
  changeTheme,
  theme,
}) => {
  return (
    <header className="p-4 shadow-md">
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={theme === "light" ? logoB1 : logoB2}
            alt="Logo"
            className="logo mr-4"
          />
        </Link>

        <form onSubmit={handleQuerySubmit} className="flex-1 mx-4">
          <Input
            className="w-full p-3 border border-gray-300 rounded-lg text-black bg-transparent"
            placeholder="Search by address / txn hash / block / token..."
            value={query}
            onChange={handleQueryChange}
          />
        </form>

        <div className="flex items-center space-x-4">
          <Link to="/Chat" className="text-white hover:text-gray-200">
            <Bot size={50} color={theme === "light" ? "black" : "white"} />
          </Link>
          <button
            onClick={toggleAnimation}
            className="text-white hover:text-gray-200"
          >
            <Boxes size={50} color={theme === "light" ? "black" : "white"} />
          </button>
          <button
            onClick={changeTheme}
            className="text-white hover:text-gray-200"
          >
            <Moon size={50} color={theme === "light" ? "black" : "white"} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
