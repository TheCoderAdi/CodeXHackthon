import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { serverUrl } from "../redux/action";
import "../styles/chat.scss";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const socket = io(serverUrl);
  useEffect(() => {
    // Fetch user information from local storage
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUser(userFromLocalStorage);

    // Connect to the socket.io server
    // Fetch messages from the server
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${serverUrl}/message/${userFromLocalStorage._id}`
        );
        setMessages(data.messages);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();

    // Listen for new messages from the server
    socket.on("new message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      // Disconnect the socket.io connection when the component unmounts
      socket.disconnect();
    };
  }, [id]);

  // Send a message to the server
  const sendMessage = () => {
    setLoading(true);
    const newMessage = {
      user: user._id,
      vendor: id,
      message: message,
    };
    socket.emit("new message", newMessage);
    setMessage("");

    setLoading(false);
  };
  const navigate = useNavigate();
  const handlenavigate = (id) => {
    navigate(`/feedback/${id}`);
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="chat">
          <h1>Chat with Vendor</h1>
          <button
            style={{
              width: "20%",
              marginLeft: "1rem",
              borderRadius: "1rem",
              cursor: "pointer",
              padding: "1rem",
            }}
            onClick={() => handlenavigate(id)}
          >
            Feedback the vendor
          </button>
          <div className="messages">
            {messages &&
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${
                    msg.user === user.name ? "outgoing" : "incoming"
                  }`}
                >
                  <p className="sender">
                    {msg.user === user ? "User" : "Vendor"}-
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
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
