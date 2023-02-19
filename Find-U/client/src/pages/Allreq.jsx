import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { serverUrl } from "../redux/action";
import { useNavigate } from "react-router-dom";
import "../styles/allreq.scss";

const Allreq = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const userr = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllRequest = async () => {
      setLoading(true);
      const { data } = await axios.get(
        `${serverUrl}/vendor/allreq/${userr._id}`
      );
      setData(data);
      setLoading(false);
    };
    getAllRequest();
  }, [userr._id]);
  useEffect(() => {
    if (user && user.role === "user") navigate("/");
  }, [user, navigate]);
  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : data.length > 0 ? (
        <div className="req-user">
          {data.map((d, id) => {
            return (
              <div className="req-user-one" key={id}>
                <h1>User Name:- {d.user.name} </h1>
                <br />
                <p>Wanted item:- {d.item}</p>
                <p>Description:- {d.description}</p>
                <div className="buttons">
                  <button onClick={() => navigate(`/chat/user/${d.user._id}`)}>
                    Accept
                  </button>
                  <button>Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="req-user1">
          <p>No Requests Found</p>
        </div>
      )}
    </>
  );
};

export default Allreq;
