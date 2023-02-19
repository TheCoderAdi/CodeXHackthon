import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteProfile, logout } from "../redux/action";
import "../styles/profile.scss";
import Loader from "../components/Loader";
import profilePic from "../assets/profile.png";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "8rem",
  },
  button: {
    marginTop: "1rem",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "0.9rem",
    width: "100%",
    outline: "none",
    border: "2px solid hsl(319, 19%, 77%)",
    padding: "0.5rem 1.4rem",
    borderRadius: "0.8rem",
    transition: "all 0.2s ease-in-out",
  },
  input: {
    padding: "0.5rem",
    width: "94%",
    outline: "none",
    border: "2px solid hsl(319, 19%, 77%)",
    borderRadius: "0.5rem",
    fontSize: "1.1rem",
  },
};

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setpassword] = useState("");
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);
  const handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    let id = user._id;
    const role = user.role;
    if (!password) toast.error("Please provide a password");
    else dispatch(deleteProfile({ id, password, role }));
  };
  const logoutHandler = () => {
    let role = user && user.role;
    dispatch(logout(role));
    navigate("/");
    toast.success("Logged out");
  };
  const handleInput = (event) => {
    setpassword(event.target.value);
  };
  return (
    <div className="profileContainer">
      {user ? (
        <>
          <div className="imageUpper">
            <img src={profilePic} alt="avatar" />
          </div>
          <div className="contentLower">
            <div className="userName">{user.name}</div>

            <button className="submit-btn" onClick={() => setShowModal(true)}>
              Delete
            </button>
            <button className="submit-btn" onClick={logoutHandler}>
              Log out
            </button>
            <Modal
              isOpen={showModal}
              appElement={document.getElementById("root")}
              onRequestClose={() => setShowModal(false)}
              contentLabel="Input Modal"
              style={customStyles}
            >
              <h2>Enter Password</h2>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleInput}
                style={customStyles.input}
              />
              <button style={customStyles.button} onClick={handleSubmit}>
                Submit
              </button>
            </Modal>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Profile;
