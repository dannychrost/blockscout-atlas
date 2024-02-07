import React, { useState, useEffect } from "react";
import Tooltip from "../components/Tooltip";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const txnResponse = await fetch(
          "https://eth.blockscout.com/api/v2/transactions"
        );
        const txnData = await txnResponse.json();
        setTransactions(txnData.items || []);
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
        <div id="transactions">
          <ul>
            <li id="table-h">Latest Transactions</li>
            {transactions.map((tx, index) => (
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
            <li id="table-f">View Next Page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
