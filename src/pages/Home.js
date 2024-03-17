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
  } // Function to chunk transactions into groups of 3
  const chunkData = (data) => {
    let chunks = [];
    for (let i = 0; i < data.length; i += 3) {
      chunks.push(data.slice(i, i + 3));
    }
    return chunks;
  };

  return (
    <div className="home">
      <div>
        <div>
          <h1
            style={{
              textAlign: "center",
              color: "black",
              textShadow: "white 1px 0 10px",
            }}
          >
            <strong>Latest Blocks</strong>
          </h1>
          <div blocks={blocks.slice(0, 7)} />
          <div wrap={true} touch={true} pause={"hover"}>
            {chunkData(blocks)
              .slice(0, 7)
              .map(
                (
                  blockGroup,
                  idx // Assuming blocks is an array of arrays
                ) => (
                  <div key={idx}>
                    <div className="mb-5 justify-content-center">
                      {" "}
                      {/* Add bottom margin to give space for carousel controls */}
                      {blockGroup.map((block) => (
                        <div key={block.hash} md={2}>
                          <div className="card-block">
                            <div>
                              Block{" "}
                              <a
                                href={`https://etherscan.io/block/${block.height}`}
                                style={{ color: "black" }}
                              >
                                {block.height}
                              </a>
                            </div>
                            <div variant="flush">
                              <div>
                                Hash:{" "}
                                <Tooltip
                                  identifier={block.hash}
                                  type={"block"}
                                />
                              </div>
                              <div>
                                Validator:{" "}
                                <Tooltip
                                  identifier={block.miner.hash}
                                  type={"address"}
                                />
                              </div>
                              <div>
                                Reward:{" "}
                                {weiToEth(block.rewards[0].reward).slice(0, 7)}{" "}
                                ETH
                              </div>
                            </div>
                            <div>
                              Validated {timeSince(block.timestamp)} ago
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
      <div>
        <div>
          <h1
            style={{
              textAlign: "center",
              color: "black",
              textShadow: "white 1px 0 10px",
            }}
          >
            <strong>Latest Transactions</strong>
          </h1>
          <div wrap={true} touch={true} pause={"hover"}>
            {chunkData(transactions).map((transactionGroup, index) => (
              <div key={index}>
                <div className="mb-5 justify-content-center">
                  {transactionGroup.map((tx) => (
                    <div key={tx.hash} md={2}>
                      <div className="card-block">
                        <div>Transaction {tx.hash.substring(0, 10)}...</div>
                        <div variant="flush">
                          <div>
                            Hash: <Tooltip identifier={tx.hash} type={"hash"} />
                          </div>
                          <div>
                            From:{" "}
                            <Tooltip
                              identifier={tx.from.hash}
                              type={"address"}
                            />
                          </div>
                          <div>
                            To:{" "}
                            <Tooltip identifier={tx.to.hash} type={"address"} />
                          </div>
                          <div>Value: {weiToEth(tx.value)} ETH</div>
                          <div>
                            Fee:{" "}
                            {calculateTransactionFee(tx.gas_price, tx.gas_used)}{" "}
                            ETH
                          </div>
                        </div>
                        <div>Validated {timeSince(tx.timestamp)} ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
