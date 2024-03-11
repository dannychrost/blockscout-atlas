import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import Tooltip from "../components/Tooltip";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Row, Col } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
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
      <Row>
        <Col>
          <h1
            style={{
              textAlign: "center",
              color: "black",
              textShadow: "white 1px 0 10px",
            }}
          >
            <strong>Latest Blocks</strong>
          </h1>

          <Carousel wrap={true} touch={true} pause={"hover"}>
            {chunkData(blocks).map(
              (
                blockGroup,
                idx // Assuming blocks is an array of arrays
              ) => (
                <Carousel.Item key={idx}>
                  <Row className="mb-5 justify-content-center">
                    {" "}
                    {/* Add bottom margin to give space for carousel controls */}
                    {blockGroup.map((block) => (
                      <Col key={block.hash} md={2}>
                        <Card className="card-block">
                          <Card.Header>
                            Block{" "}
                            <a
                              href={`https://etherscan.io/block/${block.height}`}
                              style={{ color: "black" }}
                            >
                              {block.height}
                            </a>
                          </Card.Header>
                          <ListGroup variant="flush">
                            <ListGroup.Item>
                              Hash:{" "}
                              <Tooltip identifier={block.hash} type={"block"} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Validator:{" "}
                              <Tooltip
                                identifier={block.miner.hash}
                                type={"address"}
                              />
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Reward:{" "}
                              {weiToEth(block.rewards[0].reward).slice(0, 7)}{" "}
                              ETH
                            </ListGroup.Item>
                          </ListGroup>
                          <Card.Footer>
                            Validated {timeSince(block.timestamp)} ago
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              )
            )}
          </Carousel>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1
            style={{
              textAlign: "center",
              color: "black",
              textShadow: "white 1px 0 10px",
            }}
          >
            <strong>Latest Transactions</strong>
          </h1>
          <Carousel wrap={true} touch={true} pause={"hover"}>
            {chunkData(transactions).map((transactionGroup, index) => (
              <Carousel.Item key={index}>
                <Row className="mb-5 justify-content-center">
                  {transactionGroup.map((tx) => (
                    <Col key={tx.hash} md={2}>
                      <Card className="card-block">
                        <Card.Header>
                          Transaction {tx.hash.substring(0, 10)}...
                        </Card.Header>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            Hash: <Tooltip identifier={tx.hash} type={"hash"} />
                          </ListGroup.Item>
                          <ListGroup.Item>
                            From:{" "}
                            <Tooltip
                              identifier={tx.from.hash}
                              type={"address"}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item>
                            To:{" "}
                            <Tooltip identifier={tx.to.hash} type={"address"} />
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Value: {weiToEth(tx.value)} ETH
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Fee:{" "}
                            {calculateTransactionFee(tx.gas_price, tx.gas_used)}{" "}
                            ETH
                          </ListGroup.Item>
                        </ListGroup>
                        <Card.Footer>
                          Validated {timeSince(tx.timestamp)} ago
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
