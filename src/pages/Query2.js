import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Query.css";

function Query() {
  const { searchTerm } = useParams(); // This is how you get the address URL parameter
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [nextPageParams, setNextPageParams] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [txCount, setTxCount] = useState(0);
  const [currentParams, setCurrentParams] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTransactions([]);
    setNextPageParams({});
    setHasMore(true);
    setLoading(true);
    // Get the amount of transactions that the specified wallet address has
    async function fetchTxCount() {
      setCurrentPage(1);
      fetch(
        `https://eth.blockscout.com/api/v2/addresses/${searchTerm}/counters`
      )
        .then((response) => response.json())
        .then((data) => {
          const transactionCount = data.transactions_count;
          setTxCount(transactionCount);
          console.log(transactionCount);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    fetchTxCount();
  }, [searchTerm]);
  useEffect(() => {
    async function fetchData() {
      const params = new URLSearchParams(nextPageParams).toString();
      if (params === currentParams && currentParams.length > 0) {
        setHasMore(false);
        setLoading(false);
        return;
      } else {
        setCurrentParams(params);
      }
      try {
        const response = await fetch(
          `https://eth.blockscout.com/api/v2/addresses/${searchTerm}/transactions?${params}`
        );
        const data = await response.json();
        console.log(
          `https://eth.blockscout.com/api/v2/addresses/${searchTerm}/transactions?${params}`
        );

        if (data.items && data.items.length > 0) {
          // First, filter out duplicates from the new transactions
          const uniqueNewTransactions = Array.from(
            new Set(data.items.map((tx) => tx.hash))
          ).map((hash) => data.items.find((tx) => tx.hash === hash));

          // Then, filter out any new transaction that already exists in the transactions state
          const newTransactions = uniqueNewTransactions.filter(
            (newTx) =>
              !transactions.some((existingTx) => existingTx.hash === newTx.hash)
          );

          // Append only unique transactions to the state
          setTransactions((prevTransactions) => {
            const combined = [...prevTransactions, ...newTransactions];
            const uniqueCombined = Array.from(
              new Set(combined.map((tx) => tx.hash))
            ).map((hash) => combined.find((tx) => tx.hash === hash));
            return uniqueCombined;
          });

          if (newTransactions.length < 50) {
            setHasMore(false);
          } else {
            const lastTransaction = newTransactions[newTransactions.length - 1];
            setNextPageParams({
              block_number: lastTransaction.block,
              index: lastTransaction.position + 1,
              items_count: 50,
            });
          }
        } else {
          setHasMore(false);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    if (hasMore) {
      fetchData();
    }
  }, [searchTerm, nextPageParams, hasMore]);

  if (loading) {
    return (
      <div id="loading-bg">
        <h1 id="loading-text">Loading...</h1>
      </div>
    );
  }

  const transactionsPerPage = 25;

  const handleNextPage = () => {
    const totalPages = Math.ceil(txCount / transactionsPerPage);
    setCurrentPage((prevPage) => {
      return prevPage < totalPages ? prevPage + 1 : prevPage;
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => {
      return prevPage > 1 ? prevPage - 1 : prevPage;
    });
  };

  const displayedTransactions = () => {
    var startIndex = (currentPage - 1) * transactionsPerPage;
    var endIndex = startIndex + transactionsPerPage;
    console.log(
      `Current Page: ${currentPage} Start Index: ${startIndex} End Index: ${endIndex}`
    );
    if (endIndex <= txCount) {
      return transactions.slice(startIndex, endIndex);
    } else {
      return transactions.slice(startIndex, txCount);
    }
  };

  return (
    <div className="query">
      <div id="query-container">
        <div id="queries">
          <li id="table-h">{txCount} Total Transactions</li>
          <ul>
            {displayedTransactions().map((transaction, index) => (
              <li key={transaction.hash}>
                <strong>
                  {(currentPage - 1) * transactionsPerPage + index + 1}.
                </strong>
                <a
                  className="hash-links"
                  href={`https://etherscan.io/tx/${transaction.hash}`}
                >
                  {transaction.hash}
                </a>
              </li>
            ))}
            <li id="table-f">
              <button
                id="query-table-l"
                className="query-table-btn"
                onClick={handlePrevPage}
              >
                {"Back"}
              </button>
              <button id="query-table-m" className="query-table-btn">
                {`Page ${currentPage} of ${Math.ceil(txCount / 25)}`}
              </button>
              <button
                id="query-table-r"
                className="query-table-btn"
                onClick={handleNextPage}
              >
                {"Next"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Query;
