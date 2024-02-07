import React, { useState } from "react";
import "../styles/Tooltip.css"; // Make sure to create this CSS file
import { Link } from "react-router-dom";

function Tooltip({ identifier, type }) {
  // State to manage hover status
  const [isHovering, setIsHovering] = useState(false);

  // Function to truncate the address (show only the first 6 and last 4 characters)
  const truncateIdentifier = (hsh) => `${hsh.slice(0, 6)}...${hsh.slice(-4)}`;

  // Function to construct Etherscan URL based on the type
  const getEtherscanLink = (identifier, type) => {
    const baseUrl = "https://etherscan.io";

    switch (type) {
      case "address":
        return `${baseUrl}/address/${identifier}`;
      case "hash":
        return `${baseUrl}/tx/${identifier}`;
      case "block":
        return `${baseUrl}/block/${identifier}`;
      default:
        return baseUrl;
    }
  };

  return (
    <div
      className="address-container"
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <a className="hash-links" href={getEtherscanLink(identifier, type)}>
        {truncateIdentifier(identifier)}
      </a>
      {isHovering && <span className="address-tooltip">{identifier}</span>}
    </div>
  );
}

export default Tooltip;
