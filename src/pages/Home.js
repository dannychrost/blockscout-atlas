import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import Tooltip from "../components/Tooltip";
import { useNavigate } from "react-router-dom";

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goToBlocks = () => {
    navigate("/Blocks");
  };

  // Function to navigate to Transactions page
  const goToTransactions = () => {
    navigate("/Transactions");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const txnResponse = await fetch(
          "https://eth.blockscout.com/api/v2/transactions"
        );
        const txnData = await txnResponse.json();
        setTransactions(txnData.items || []);

        // Assuming you have a similar endpoint for blocks
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

  if (loading) {
    return (
      <div id="loading-bg">
        <h1 id="loading-text">Loading...</h1>
      </div>
    );
  }

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

  return (
    <div className="home">
      <div id="bt-container">
        <div id="blocks">
          <ul>
            <li id="table-h">Latest Blocks</li>
            {blocks.slice(0, 6).map((block, index) => (
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
            <li id="table-f">
              <button className="bt-table-btn" onClick={goToBlocks}>
                View All Blocks
              </button>
            </li>
          </ul>
        </div>
        <div id="transactions">
          <ul>
            <li id="table-h">Latest Transactions</li>
            {transactions.slice(0, 6).map((tx, index) => (
              <li key={tx.hash} classname="mp">
                <div className="transaction-info">
                  <strong>{index + 1}</strong>
                </div>

                <div className="transaction-info">
                  <strong>Hash:</strong>{" "}
                  <Tooltip identifier={tx.hash} type={"hash"} />
                  <strong>Time:</strong> {timeSince(tx.timestamp)} ago
                </div>
                <div className="transaction-info">
                  <strong>From:</strong>{" "}
                  <Tooltip identifier={tx.from.hash} type={"address"} />
                  <strong>To:</strong>{" "}
                  <Tooltip identifier={tx.to.hash} type={"address"} />
                </div>
                <div className="transaction-info">
                  <strong>Value:</strong> {weiToEth(tx.value)} ETH
                  <strong>Fee:</strong>
                  {calculateTransactionFee(tx.gas_price, tx.gas_used)} ETH
                </div>
              </li>
            ))}
            <li id="table-f">
              <button className="bt-table-btn" onClick={goToTransactions}>
                View All Transactions
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
