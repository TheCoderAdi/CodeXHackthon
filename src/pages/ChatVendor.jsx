import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { serverUrl } from "../redux/action";
import { useParams } from "react-router-dom";
import "../styles/chat.scss";
import axios from "axios";
import Loader from "../components/Loader";

const ChatVendor = () => {
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const [userV, setUserV] = useState("");
  const { id } = useParams();

  useEffect(() => {
    socketRef.current = io.connect(serverUrl);
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUserV(userFromLocalStorage.name);
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${serverUrl}/message/vendors/${userFromLocalStorage._id}`
        );
        setMessages(data.messages);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
    socketRef.current.on("connect", () => {
      console.log("connected to socket");
      socketRef.current.emit("join", { vendor: user._id, user: id });
    });

    socketRef.current.on("new message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    setLoading(true);
    const data = { user: id, vendor: user._id, message: message };
    socketRef.current.emit("new message", data);
    setMessage("");
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="chat">
          <h1>Chat with User</h1>
          <div className="messages">
            {messages &&
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${
                    msg.vendor === userV ? "incoming" : "outgoing"
                  }`}
                >
                  <p className="sender">
                    {msg.vendor === userV ? "Vendor" : "User"}-
                  </p>
                  <p className="text">{msg.message}</p>
                </div>
              ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatVendor;
