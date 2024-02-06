require("dotenv").config();
const fs = require("fs"); // At the top of your file
const path = require("path"); // Also at the top of your file
const axios = require("axios");
const port = 3000;

const cors = require("cors");
const express = require("express");
const app = express();

// Setup CORS and JSON body parser
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Frontend origin
  })
);
app.use(express.json()); // Parse JSON bodies

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const sendbirdApi = axios.create({
  baseURL: `https://api-${process.env.SENDBIRD_APPLICATION_ID}.sendbird.com/v3`,
  headers: {
    "Api-Token": process.env.SENDBIRD_APPLICATION_ID,
    "Content-Type": "application/json; charset=utf8",
  },
});

app.post("/generate-phrase", async (req, res) => {
  try {
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              "Generate a unique mnemonic phrase that is 16-32 words long.",
          },
        ],
        temperature: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const phrase = openaiResponse.data.choices[0].message.content.trim();
    res.json({ phrase: phrase });
  } catch (error) {
    console.error("Error in generating phrase:", error);
    res.status(500).send("Error in generating phrase");
  }
});

// Test but can be used
app.post("/addUser", async (req, res) => {
  try {
    const response = await sendbirdApi.post("/users", {
      user_id: req.body.user_id,
      nickname: req.body.nickname,
      issue_access_token: true,
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Handle new message with OpenAI response
app.post("/handleNewMessage", async (req, res) => {
  // Process the webhook data
  //console.log(req.body);

  const userId = req.body.sender.user_id;
  const channelUrl = req.body.channel.channel_url;
  const threadId = req.body.channel.data;
  const message = req.body.payload.message;

  // Check if the sender is not 'atlas'
  if (userId !== "atlas") {
    // Create a message
    await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        role: "user",
        content: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1",
        },
      }
    );
    // Create a run
    const runObj = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        assistant_id: "asst_eTCXZUeq0Dzogwtsa3WrFzWJ",
        tools: [
          {
            type: "function",
            function: {
              name: "searchData",
              description:
                "Search for data using specific parameters. Should only be used if the user asks for information regarding a specific ticker representing a token or coin on the Ethereum network. Examples include: MANA, Decentraland, USDT, Aave, USDC, Curve. ", // Optional description of the function
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query string",
                  },
                  // ... add other parameters as needed ...
                },
                required: ["query"], // List of required parameters
              },
            },
          },
          {
            type: "function",
            function: {
              name: "getAddressCounters",
              description:
                "Retrieve various counters related to a specific address. If the user asks about how many transactions belong to a specific address, this can be used.",
              parameters: {
                type: "object",
                properties: {
                  address_hash: {
                    type: "string",
                    description: "The hash of the address.",
                  },
                },
                required: ["address_hash"],
              },
            },
          },
          // New 'getTxInfo' function
          {
            type: "function",
            function: {
              name: "getTxInfo",
              description:
                "Retrieves detailed information about a transaction, given its hash.",
              parameters: {
                type: "object",
                properties: {
                  transaction_hash: {
                    type: "string",
                    description: "The hash of the transaction",
                  },
                  // ... additional properties if needed ...
                },
                required: ["transaction_hash"],
              },
            },
          },
          // New 'getBlockInfo' function
          {
            type: "function",
            function: {
              name: "getBlockInfo",
              description:
                "Retrieves information about a specific block, identified by its number or hash.",
              parameters: {
                type: "object",
                properties: {
                  block_number_or_hash: {
                    type: "string",
                    description:
                      "The block number or hash for which information is being fetched.",
                  },
                  // ... additional properties if needed ...
                },
                required: ["block_number_or_hash"],
              },
            },
          },
          // New 'getAddressTransactions' function
          {
            type: "function",
            function: {
              name: "getAddressTransactions",
              description:
                "Get the transactions of a particular wallet address. This function should be used if the user asks for the newest, oldest, or a random set of x transactions of a particular wallet address.",
              parameters: {
                type: "object",
                properties: {
                  address_hash: {
                    type: "string",
                    description: "Address hash",
                  },
                  quantity: {
                    type: "integer",
                    description: "Number of transactions to retrieve",
                  },
                  transaction_type: {
                    type: "string",
                    description:
                      "Type of transactions to retrieve (newest, oldest, random).",
                    enum: ["newest", "oldest", "random"],
                  },
                  filter: {
                    type: "string",
                    description: "Filter transactions by 'to' or 'from'",
                    enum: ["to", "from"],
                  },
                  block_number: {
                    type: "integer",
                    description: "Block number for pagination",
                  },
                  fee: {
                    type: "string",
                    description: "Transaction fee for pagination",
                  },
                  hash: {
                    type: "string",
                    description: "Transaction hash for pagination",
                  },
                  index: {
                    type: "integer",
                    description: "Transaction index for pagination",
                  },
                  inserted_at: {
                    type: "string",
                    description: "Insertion time for pagination",
                    format: "date-time",
                  },
                  items_count: {
                    type: "integer",
                    description: "Number of items for pagination",
                  },
                  value: {
                    type: "string",
                    description: "Transaction value for pagination",
                  },
                  // ... additional next page parameters if any ...
                },
                required: ["address_hash", "quantity", "transaction_type"], // 'address_hash', 'quantity', and 'transaction_type' are required parameters.
              },
              // ... response and other definitions ...
            },
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1",
        },
      }
    );

    const runId = runObj.data.id;
    let runStatus = null;
    let requireAction = null;
    // Retrieve the run
    const maxChecks = 60; // Maximum number of checks
    const delay = 5000; // Delay in milliseconds (5000ms = 5s)

    let checks = 0;

    while (checks < maxChecks) {
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for specified delay
      const runResponse = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1",
          },
        }
      );

      runStatus = runResponse.data.status; // Adjust this based on actual response structure
      requireAction = runResponse.data.required_action; // Get the required action if any
      console.log(
        "run status is: ",
        runStatus,
        "\nrequired_action=",
        requireAction,

        "\nIteration is: ",
        checks
      );
      //console.log("\n\n\nbody:\n", JSON.stringify(runResponse.data, null, 2));
      console.log();
      // ... [rest of your code] ...

      if (
        runStatus === "requires_action" &&
        requireAction &&
        requireAction.type === "submit_tool_outputs"
      ) {
        let toolCalls = requireAction.submit_tool_outputs.tool_calls;
        let toolOutputs = [];

        const logs = []; // Array to hold log entries
        const logDir = "logFiles"; // Name of the directory to store logs

        for (const toolCall of toolCalls) {
          const toolCallId = toolCall.id;
          console.log("toolCallId = ", toolCallId);
          const functionName = toolCall.function.name;
          let args = JSON.parse(toolCall.function.arguments);

          console.log("toolCall = ", toolCall);
          console.log("toolCall.function = ", toolCall.function);
          console.log("functionName = ", functionName);
          console.log("arguments = ", args);

          try {
            let output = await performActionForToolCall(toolCall);
            // Directly use the output object if it's an object, otherwise use the output as is
            let formattedOutput = JSON.stringify(output);

            toolOutputs.push({
              tool_call_id: toolCallId,
              output: formattedOutput,
            });

            // Log successful output with additional details
            logs.push({
              timestamp: new Date().toISOString(),
              toolCallId,
              toolCall,
              functionName,
              arguments: args,
              output: output,
              error: null,
            });
          } catch (error) {
            // Log the error with additional details
            console.error(`Error processing toolCallId=${toolCallId}: `, error);

            logs.push({
              toolCallId,
              toolCall,
              functionName,
              arguments: args,
              output: null,
              error: error.message || "Unknown error",
            });
          }
        }

        // Create the directory if it doesn't exist
        fs.mkdirSync(path.join(__dirname, logDir), { recursive: true });

        // Write the logs to a JSON file in the specified directory
        const logFilePath = path.join(__dirname, logDir, "toolCallLogs.json");
        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
          if (err) {
            console.error("Error writing log file:", err);
          } else {
            console.log(`Log file saved at ${logFilePath}.`);
          }
        });

        // Now submit all tool outputs together
        await submitAllToolOutputs(threadId, runId, toolOutputs);
      } else if (runStatus === "completed") {
        // Run is complete or in a state that does not require action, break out of the loop
        break;
      }

      checks++;
    }
    // Retrieve the list of messages in the thread
    const messagesResponse = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1",
        },
      }
    );

    const messages = messagesResponse.data.data;
    let messageContent = "Hello, this is a response from the server.";

    // Find the latest message from the Assistant
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role !== "user") {
        messageContent = messages[i].content[0].text.value;
        break;
      }
    }

    // Replace URLs in the content with URLs surrounded by spaces
    messageContent = messageContent.replace(/(\bhttps?:\/\/[^\s\)]+)/g, " $1 ");
    // Prepare the request to Sendbird API
    const sendMessageUrl = `https://api-${req.body.app_id}.sendbird.com/v3/group_channels/${channelUrl}/messages`;
    const data = {
      message_type: "MESG",
      user_id: "atlas", // Assuming 'atlas' is your bot's user ID
      message: messageContent,
    };

    const config = {
      headers: {
        "Api-Token": process.env.SENDBIRD_API_TOKEN, // Replace with your Sendbird API token
        "Content-Type": "application/json",
      },
    };

    try {
      // Sending a message to the channel
      await axios.post(sendMessageUrl, data, config);
    } catch (error) {
      console.error("Error sending message to Sendbird:", error);
    }
  }

  // Respond to Sendbird
  res.status(200).send("User message processed");
});
async function submitAllToolOutputs(threadId, runId, toolOutputs) {
  // Convert the outputs to the expected format
  let formattedToolOutputs = toolOutputs.map((output) => ({
    tool_call_id: output.tool_call_id,
    output: JSON.stringify(output.output), // Ensure output is a JSON string
  }));

  const data = {
    tool_outputs: formattedToolOutputs,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v1",
    },
  };

  //console.log("Sending POST request with data:", JSON.stringify(data, null, 2));

  try {
    const response = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}/submit_tool_outputs`,
      data,
      config
    );
    console.log("Tool outputs submitted, response data:", response.data);
  } catch (error) {
    console.error("Error submitting tool outputs:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status code:", error.response.status);
      console.error("Error headers:", error.response.headers);
    }
  }
}

async function performActionForToolCall(toolCall) {
  const functionName = toolCall.function.name;
  let args = JSON.parse(toolCall.function.arguments);

  if (args.query) {
    args.q = args.query;
    delete args.query;
  }

  console.log("toolCall = ", toolCall);
  console.log("toolCall.function = ", toolCall.function);
  console.log("functionName = ", functionName);
  console.log("arguments = ", args);

  let output = {};
  // /search
  if (functionName === "searchData") {
    try {
      const apiResponse = await axios.get(
        "https://eth.blockscout.com/api/v2/search",
        {
          params: args,
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("Final URL called:", apiResponse.config.url);
      output = apiResponse.data;

      // Check and trim payload size if necessary
      const MAX_PAYLOAD_SIZE = 100000; // Adjust as per requirement
      let payloadSize = getPayloadSize(output);
      console.log("Initial payloadSize = ", payloadSize);
      while (
        payloadSize > MAX_PAYLOAD_SIZE &&
        output.items &&
        output.items.length > 0
      ) {
        output.items.pop(); // Remove the last item
        payloadSize = getPayloadSize(output);
        console.log("Reduced payloadSize = ", payloadSize);
      }

      if (payloadSize > MAX_PAYLOAD_SIZE) {
        console.error("Unable to reduce the payload size sufficiently.");
        output = {}; // Clear output if it's still too large
      }
    } catch (error) {
      console.error("Error performing searchData:", error);
      if (error.response) {
        console.error("Error Data:", error.response.data);
        console.error("Error Status:", error.response.status);
        console.error("Error Headers:", error.response.headers);
      }
      output = {}; // Clear output on error
    }
  }
  // /addresses/{address_hash}/counters
  else if (functionName === "getAddressCounters") {
    try {
      const apiResponse = await axios.get(
        `https://eth.blockscout.com/api/v2/addresses/${args.address_hash}/counters`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("Final URL called:", apiResponse.config.url);
      output = apiResponse.data;

      // Check and trim payload size if necessary
      const MAX_PAYLOAD_SIZE = 100000; // Adjust as per requirement
      let payloadSize = getPayloadSize(output);
      console.log("Initial payloadSize = ", payloadSize);
      while (
        payloadSize > MAX_PAYLOAD_SIZE &&
        output.counters &&
        output.counters.length > 0
      ) {
        output.counters.pop(); // Reduce the size of payload if it's an array, adjust based on actual response structure
        payloadSize = getPayloadSize(output);
        console.log("Reduced payloadSize = ", payloadSize);
      }

      if (payloadSize > MAX_PAYLOAD_SIZE) {
        console.error("Unable to reduce the payload size sufficiently.");
        output = {}; // Clear output if it's still too large
      }
    } catch (error) {
      console.error("Error performing getAddressCounters:", error);
      if (error.response) {
        console.error("Error Data:", error.response.data);
        console.error("Error Status:", error.response.status);
        console.error("Error Headers:", error.response.headers);
      }
      output = {}; // Clear output on error
    }
  }
  // /transactions/{transaction_hash}
  else if (functionName === "getTxInfo") {
    try {
      const apiResponse = await axios.get(
        `https://eth.blockscout.com/api/v2/transactions/${args.transaction_hash}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("Final URL called:", apiResponse.config.url);
      output = apiResponse.data;

      // Add necessary logic to handle the response and trim payload size if necessary
      // ...
    } catch (error) {
      console.error("Error performing getTxInfo:", error);
      if (error.response) {
        console.error("Error Data:", error.response.data);
        console.error("Error Status:", error.response.status);
        console.error("Error Headers:", error.response.headers);
      }
      output = {}; // Clear output on error
    }
  }
  // /blocks/{block_number_or_hash}
  else if (functionName === "getBlockInfo") {
    try {
      const apiResponse = await axios.get(
        `https://eth.blockscout.com/api/v2/blocks/${args.block_number_or_hash}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("Final URL called:", apiResponse.config.url);
      output = apiResponse.data;

      // Add necessary logic to handle the response and trim payload size if necessary
      // ...
    } catch (error) {
      console.error("Error performing getBlockInfo:", error);
      if (error.response) {
        console.error("Error Data:", error.response.data);
        console.error("Error Status:", error.response.status);
        console.error("Error Headers:", error.response.headers);
      }
      output = {}; // Clear output on error
    }
  }
  // /addresses/{address_hash}/transactions
  else if (functionName === "getAddressTransactions") {
    console.log("\n\n\n\ngetAddressTransaction:");
    const transactionType = args.transaction_type || "newest"; // Default to 'newest' if not specified
    console.log("transactionType = ", transactionType);
    let requestedTxCount = args.requested_count
      ? parseInt(args.requested_count, 10)
      : 10; // Default to 10 if not specified

    // Fetch total transaction count first
    const totalTxCount = await getTotalTransactionCount(args.address_hash);
    if (totalTxCount === null) {
      console.error("Failed to fetch the total transaction count. Exiting...");
      output = {
        items: [],
        error: "Failed to fetch the total transaction count.",
      };
      return output;
    }
    // If requestedTxCount is more than totalTxCount, adjust it
    requestedTxCount = Math.min(requestedTxCount, totalTxCount, 10);

    let hasMorePages = true;
    let allTransactions = [];
    let currentPage = 1;

    let seenHashes = new Set(); // to keep track of unique transactions
    let apiParams = { filter: "to | from" }; // Initialize apiParams with the base filter parameter

    while (hasMorePages && allTransactions.length < totalTxCount) {
      try {
        // Form the full URL for the API call
        const baseURL = `https://eth.blockscout.com/api/v2/addresses/${args.address_hash}/transactions`;
        const queryString = new URLSearchParams(apiParams).toString();
        const fullURL = `${baseURL}?${queryString}`;

        // Define the directory and file for logging
        const logDir = path.join(__dirname, "logFiles");
        const logFile = path.join(logDir, "txListLogs.json");

        // Ensure the log directory exists
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }

        // Log the URL to the file
        const logEntry = {
          timestamp: new Date().toISOString(),
          page: currentPage,
          url: fullURL,
        };
        fs.appendFileSync(logFile, JSON.stringify(logEntry, null, 2) + ",\n");

        // Perform the API request
        let apiResponse = await axios.get(fullURL, {
          headers: { Accept: "application/json" },
        });
        console.log("Full URL:", fullURL);
        console.log(`Page ${currentPage} URL called:`, apiResponse.config.url);

        // Process the response and collect new transactions
        let data = apiResponse.data;
        let newTransactions = data.items || [];
        newTransactions.forEach((tx) => {
          if (
            !seenHashes.has(tx.hash) &&
            allTransactions.length < totalTxCount
          ) {
            allTransactions.push(tx);
            seenHashes.add(tx.hash);
          }
        });
        console.log("allTransactions.length: ", allTransactions.length);
        console.log("seenHashes.size: ", seenHashes.size);
        console.log("totalTxCount = ", totalTxCount);
        // Check for the next page
        if (data.next_page_params && allTransactions.length < totalTxCount) {
          // Update apiParams with the next_page_params for the next iteration
          apiParams = { ...apiParams, ...data.next_page_params };
          currentPage++;
          console.log(
            "Next page params: ",
            JSON.stringify(data.next_page_params)
          );
          await delay(100); // Wait for 5 seconds before the next API call
        } else {
          console.log(
            "No more pages or fetched requested number of transactions."
          );
          hasMorePages = false; // Indicate that there are no more pages to fetch
        }
      } catch (error) {
        console.error(`Error on page ${currentPage}:`, error);
        if (error.response) {
          console.error("Error Data:", error.response.data);
          console.error("Error Status:", error.response.status);
          console.error("Error Headers:", error.response.headers);
        }
        hasMorePages = false;
        output = {
          items: allTransactions,
          error: "An error occurred while fetching transactions.",
        };
        return output;
      }
    }

    // After fetching all transactions, process them based on the transaction type
    console.log(`Fetched ${allTransactions.length} transactions in total.`);

    // Sort transactions by timestamp
    allTransactions.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    let processedTransactions;
    switch (transactionType) {
      case "newest":
        // Get the newest transactions
        processedTransactions = allTransactions.slice(0, requestedTxCount);
        break;
      case "oldest":
        // Get the oldest transactions (reverse order if necessary)
        processedTransactions = allTransactions
          .slice(-requestedTxCount)
          .reverse();
        break;
      default:
        // Default: Get the newest transactions
        processedTransactions = allTransactions.slice(0, requestedTxCount);
        break;
    }

    // Assign processed transactions to output
    output = { items: processedTransactions };

    console.log(
      `Processed and sorted ${processedTransactions.length} transactions.`
    );
  }

  return output;
}

// Utility functions to introduce delay and payloadSize
function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
function getPayloadSize(payload) {
  const payloadString = JSON.stringify(payload);
  return Buffer.byteLength(payloadString, "utf8");
}
async function getTotalTransactionCount(address_hash) {
  try {
    const response = await axios.get(
      `https://eth.blockscout.com/api/v2/addresses/${address_hash}/counters`,
      {
        headers: { Accept: "application/json" },
      }
    );
    const data = response.data;
    return data.transactions_count; // Assuming this is the correct path
  } catch (error) {
    console.error("Error fetching transaction count:", error);
    return null; // Return null to indicate that the fetch was unsuccessful
  }
}
function processTransactions(transactions) {
  // Remove duplicate transactions based on their hash
  let uniqueTransactions = Array.from(
    new Map(transactions.map((tx) => [tx.hash, tx])).values()
  );

  // Sort transactions by timestamp in descending order (newest first)
  uniqueTransactions.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return uniqueTransactions;
}

async function getAndProcessTransactions(address_hash) {
  const totalTxCount = await getTotalTransactionCount(address_hash);

  if (totalTxCount === null) {
    console.error("Failed to fetch the total transaction count. Exiting...");
    return;
  }

  console.log(
    `Total transactions for address ${address_hash}: ${totalTxCount}`
  );

  // Fetch all transactions
  let rawTransactions = await performActionForToolCall({
    function: {
      name: "getAddressTransactions",
      arguments: JSON.stringify({ address_hash }),
    },
  });

  // Process (ensure uniqueness and sort)
  let processedTransactions = processTransactions(rawTransactions.items);

  // Now you have the processed transactions
  console.log(processedTransactions);
  return processedTransactions;
}

app.post("/create-user", async (req, res) => {
  try {
    const identity = req.body.identity;
    console.log("creating user with id ", identity);
    // Create user
    const createUserResponse = await axios.post(
      `https://api-${process.env.SENDBIRD_APPLICATION_ID}.sendbird.com/v3/users`,
      {
        user_id: identity, // Assuming 'identity' is the user ID to invite
        nickname: "Guest",
        profile_url: "",
      },
      {
        headers: {
          "Api-Token": process.env.SENDBIRD_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("user created!");
    res.json(createUserResponse.data);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

app.post("/create-channel", async (req, res) => {
  const identity = req.body.identity;
  console.log("Identity: ", identity);
  const botUserId = "atlas"; // Assuming 'atlas' is the ID of your bot user
  try {
    // Create the channel and attempt to add the user to it
    const createChannelResponse = await axios.post(
      `https://api-${process.env.SENDBIRD_APPLICATION_ID}.sendbird.com/v3/group_channels`,
      {
        name: "Chat with Atlas",
        user_ids: [identity, botUserId],
        //is_distinct: true,
        data: req.body.thread,
      },
      {
        headers: {
          "Api-Token": process.env.SENDBIRD_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const channelUrl = createChannelResponse.data.channel_url;
    console.log(
      "Channel created: ",
      channelUrl,
      "\n",
      createChannelResponse.data
    );

    // Invite and auto accept user regardless if they are already in the channel
    await axios.post(
      `https://api-${process.env.SENDBIRD_APPLICATION_ID}.sendbird.com/v3/group_channels/${channelUrl}/invite`,
      {
        user_ids: [identity], // Assuming 'identity' is the user ID to invite
      },
      {
        headers: {
          "Api-Token": process.env.SENDBIRD_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    // Send a welcome message to the newly created channel
    const welcomeMessage =
      "Hi there! Welcome to The Node Project. I'm Atlas, your go-to assistant for all things related to our site and the Blockscout API. Feel free to ask me anything, and I'll do my best to assist you!";
    const sendMessageUrl = `https://api-${process.env.SENDBIRD_APPLICATION_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages`;
    const messageData = {
      message_type: "MESG",
      user_id: botUserId,
      message: welcomeMessage,
    };

    const sendMsgResponse = await axios.post(sendMessageUrl, messageData, {
      headers: {
        "Api-Token": process.env.SENDBIRD_API_TOKEN,
        "Content-Type": "application/json",
      },
    });
    console.log("Message sent!\n");

    res.json(createChannelResponse.data);
  } catch (error) {
    console.error("Error creating channel or sending message:", error);
    res.status(500).send("Error creating channel or sending message");
  }
});

app.post("/create-thread", async (req, res) => {
  try {
    console.log("starting thread creation");
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/threads",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v1",
        },
      }
    );
    console.log("we did it");

    const thread = openaiResponse.data.id;
    res.json({ thread: thread });
  } catch (error) {
    console.error("Error creating thread: ", error);
    res.status(500).send("Error creating thread");
  }
});
