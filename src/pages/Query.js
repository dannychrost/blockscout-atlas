import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Query.css";

function Query() {
  const { searchTerm } = useParams(); // This is how you get the URL parameter
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [nextPageParams, setNextPageParams] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [txCount, setTxCount] = useState(0);
  const [currentParams, setCurrentParams] = useState("");

  useEffect(() => {
    setTransactions([]);
    setNextPageParams({});
    setHasMore(true);
    setLoading(true);
    async function fetchTxCount() {
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

  const handleNextPage = () => {
    if (hasMore) {
      setNextPageParams((prevParams) => ({
        ...prevParams,
        block_number: prevParams.block_number,
        index: prevParams.index + 1,
        items_count: 50,
      }));
    }
  };

  if (loading) {
    return (
      <div id="loading-bg">
        <h1 id="loading-text">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="query">
      <div id="query-container">
        <div id="queries">
          <h2 className="page-headers">{txCount} Transactions</h2>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={transaction.hash}>
                <strong>{index + 1}.</strong>
                <a
                  className="hash-links"
                  href={`https://etherscan.io/tx/${transaction.hash}`}
                >
                  {transaction.hash}
                </a>
                <hr />
              </li>
            ))}
          </ul>
          {hasMore ? (
            <button onClick={handleNextPage}>Load Next Page</button>
          ) : (
            <p>No more transactions to load.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Query;
