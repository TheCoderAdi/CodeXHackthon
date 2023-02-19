import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { serverUrl } from "../redux/action";

const AllChat = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([]);
  useEffect(() => {
    const getALLMessages = async () => {
      setLoading(true);
      const { data } = await axios.get(`${serverUrl}/message/${user._id}`);
      setMessage(data.messages);
      setLoading(false);
    };
    getALLMessages();
  }, [user._id]);
  useEffect(() => {
    if (user.role === "vendor") navigate("/");
  }, [user.role, navigate]);
  const handleClick = (id) => {
    navigate(`/chat/vendor/${id}`);
  };
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {message.length <= 0 ? (
            <p>No messages</p>
          ) : (
            <>
              {message.map((mess, id) => (
                <>
                  <p>Vendor :-{mess.vendor} </p>
                  <button onClick={() => handleClick(mess.vendorId)}>
                    chat with the vendor
                  </button>
                </>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AllChat;
