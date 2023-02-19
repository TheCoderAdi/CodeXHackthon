import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginVendor } from "../redux/action";
import Loader from "../components/Loader";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { login } from "../redux/action";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "10rem",
    backgroundColor: "hsl(53,60%,092%)",
    borderRadius: "1rem",
    boxShadow: "0 0 10px crimson",
  },
  button: {
    marginTop: "1rem",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "0.9rem",
    width: "100%",
    outline: "none",
    border: "2px solid #000",
    padding: "0.5rem 1.4rem",
    borderRadius: "0.8rem",
    transition: "all 0.2s ease-in-out",
  },
};
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(true);
  const [client, setClient] = useState(false);
  const [vendor, setVendor] = useState(false);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const validationCheck = () => {
    let flag = false;
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const { email, password } = form;
    if (!email || !password) {
      toast.error("Please fill out all the field");
    } else if (email.length < 3) {
      toast.error("Username should be more than 3 characters");
    } else if (!email.includes("@")) {
      toast.error("Email must be valid");
    } else if (!email.match(validRegex)) {
      toast.error("Email must be valid");
    } else {
      return true;
    }
    return flag;
  };
  const handleClient = () => {
    setClient(true);
    setShowModal(false);
    setVendor(false);
  };
  const handleVendor = () => {
    setVendor(true);
    setShowModal(false);
    setClient(false);
  };
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [navigate, isAuthenticated]);
  const handleOnClick = (e) => {
    e.preventDefault();
    if (validationCheck()) {
      if (client) dispatch(login(form));
      else dispatch(loginVendor(form));
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Modal
            isOpen={showModal}
            appElement={document.getElementById("root")}
            contentLabel="Input Modal"
            style={customStyles}
          >
            <h2>Logged in as</h2>
            <button style={customStyles.button} onClick={handleClient}>
              Client
            </button>
            <button style={customStyles.button} onClick={handleVendor}>
              Vendor
            </button>
          </Modal>
          {vendor || client ? (
            <>
              <div className="containerRegister">
                <h1>Login here</h1>
                <form className="boxR">
                  <legend>Email</legend>
                  <input
                    type="email"
                    value={form.email}
                    name="email"
                    onChange={inputHandler}
                  />
                  <legend>Password</legend>
                  <input
                    type="password"
                    value={form.password}
                    name="password"
                    onChange={inputHandler}
                  />
                  <button onClick={handleOnClick}>Login</button>
                </form>
                <span>
                  Don't have an account?
                  <Link className="aBtn" to="/register">
                    Register here
                  </Link>
                </span>
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default Login;
