import "../styles/Chat.css";
import SendbirdApp from "@sendbird/uikit-react/App";
import "@sendbird/uikit-react/dist/index.css";
import SHA256 from "crypto-js/sha256";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Chat() {
  const [isChatVisible, setChatVisible] = useState(true);
  //const [chatSize, setChatSize] = useState({ width: 300, height: 400 });
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    const storedIdentity = localStorage.getItem("userIdentity");
    if (storedIdentity) {
      setIdentity(storedIdentity);
    } else {
      initConvo();
    }
  }, []);

  const toggleChatVisibility = () => {
    setChatVisible(!isChatVisible);
  };

  if (!isChatVisible) {
    return <button onClick={toggleChatVisibility}>Open Chat</button>;
  }

  const initConvo = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/generate-phrase`
      );
      const randomString = response.data.phrase;
      console.log(response.data);
      const hash = SHA256(randomString).toString();
      const newIdentity = "0x" + hash.slice(0, 64);

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-user`, {
        identity: newIdentity,
      });
      console.log("Identity created!");
      localStorage.setItem("userIdentity", newIdentity); // Store the new identity in localStorage
      setIdentity(newIdentity);

      // Create thread
      const responsee = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/create-thread`
      );
      localStorage.setItem("thread", responsee.data.thread);

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-channel`, {
        identity: newIdentity,
        thread: responsee.data.thread,
      });
      console.log("Channel created! ");
    } catch (error) {
      console.error("Error generating identity:", error);
    }
  };
  try {
    return (
      <div className="Chat">
        <SendbirdApp
          appId={process.env.REACT_APP_SENDBIRD_APP_ID} // Specify your Sendbird application ID.
          userId={identity} // Specify your user ID.
        />
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>Service Unavailable</div>;
  }
}
export default Chat;
