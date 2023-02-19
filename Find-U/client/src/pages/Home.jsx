import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import chatImg from "../assets/chat.png";
import "../styles/home.scss";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userC = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="homeContainer">
      <div className="leftHome">
        <img src={chatImg} alt="chat" />
      </div>
      <div className="rightHome">
        <div className="content">
          {!userC ? (
            <h2>Be a User or Be a Vendor</h2>
          ) : userC.role === "user" ? (
            <h2>Make your requests</h2>
          ) : (
            <h2>Check All Requests</h2>
          )}
        </div>
        <div className="linkSec">
          {!isAuthenticated ? (
            <>
              <Link className="Hbtn" to="/login">
                Login
              </Link>
              <Link className="Hbtn" to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                className="Hbtn"
                to={`${userC.role === "vendor" ? "/allreq" : "create"}`}
              >
                {userC && userC.role === "vendor" ? "REQS" : "CREATE"}
              </Link>
              <Link className="Hbtn" to="/profile">
                Profile
              </Link>
            </>
          )}
        </div>
        <div className="instruction">
          <span>*Don't need your personal email</span>
          <br />
          <span>*Watch your url's analytics</span>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Home;
