import React, { useState, useEffect } from "react";
import Tooltip from "../components/Tooltip";
function Blocks() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const blockResponse = await fetch(
          "https://eth.blockscout.com/api/v2/blocks"
        );
        const blockData = await blockResponse.json();
        setBlocks(blockData.items || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function weiToEth(val) {
    if (val == 0) return val;
    return `${val / 10e17}`;
  }

  function calculateTransactionFee(gasPrice, gasUsed) {
    return weiToEth(gasPrice * gasUsed);
  }

  function timeSince(dateParam) {
    const date =
      typeof dateParam === "string" ? new Date(dateParam) : dateParam;
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  if (loading) {
    return (
      <div id="loading-bg">
        <h1 id="loading-text">Loading...</h1>
      </div>
    );
  }
  return (
    <div className="home">
      <div id="bt-container">
        <div id="blocks">
          <ul>
            <li id="table-h">Latest Blocks</li>
            {blocks.map((block, index) => (
              <li key={block.hash}>
                <div className="transaction-info">
                  <strong>{index + 1}</strong>
                </div>
                <div className="block-info">
                  <strong>Hash:</strong>{" "}
                  <Tooltip identifier={block.hash} type={"block"} />
                  <strong>Time:</strong> {timeSince(block.timestamp)} ago
                </div>
                <div className="block-info">
                  <strong>Validator:</strong>{" "}
                  <Tooltip identifier={block.miner.hash} type={"address"} />
                  <strong>Height:</strong>
                  <a href={`https://etherscan.io/block/${block.height}`}>
                    <div className="height-inner">{block.height}</div>
                  </a>
                </div>
                <div className="reward-info">
                  <strong>Reward:</strong>{" "}
                  <div className="reward-info-inner">
                    {weiToEth(block.rewards[0].reward).slice(0, 7)} ETH
                  </div>
                </div>
              </li>
            ))}
            <li id="table-f">View Next Page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Blocks;
