import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerVendor } from "../redux/action";
import "../styles/register.scss";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Modal from "react-modal";
import { register } from "../redux/action";
//Custom style of modal
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
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { navigateLogin, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formV, setFormV] = useState({
    name: "",
    email: "",
    password: "",
    categories: "",
  });
  const [showModal, setShowModal] = useState(true);
  const [client, setClient] = useState(false);
  const [vendor, setVendor] = useState(false);
  const inputHandlerC = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const inputHandlerV = (e) => {
    const { name, value } = e.target;
    setFormV({
      ...formV,
      [name]: value,
    });
  };
  const validationCheckClient = () => {
    let flag = false;
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const { name, email, password } = form;
    if (!name || !email || !password) {
      toast.error("Please fill out all the field");
    } else if (name.length < 3) {
      toast.error("Username should be more than 3 characters");
    } else if (!email.includes("@")) {
      toast.error("Email must be valid");
    } else if (!email.match(validRegex)) {
      toast.error("Email must be valid");
    } else if (password.length < 8) {
      toast.error("Password must be 8 characters");
    } else {
      return true;
    }
    return flag;
  };
  const validationCheckVendor = () => {
    let flag = false;
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const { name, email, password, categories } = formV;
    if (!name || !email || !password || !categories) {
      toast.error("Please fill out all the field");
    } else if (name.length < 3) {
      toast.error("Username should be more than 3 characters");
    } else if (!email.includes("@")) {
      toast.error("Email must be valid");
    } else if (!email.match(validRegex)) {
      toast.error("Email must be valid");
    } else if (password.length < 8) {
      toast.error("Password must be 8 characters");
    } else if (categories === "") {
      toast.error("Category is not selected");
    } else {
      return true;
    }
    return flag;
  };
  useEffect(() => {
    if (isAuthenticated) navigate("/");
    if (navigateLogin) navigate("/login");
  }, [navigate, navigateLogin, isAuthenticated]);

  const handleOnClick = (e) => {
    e.preventDefault();
    if (client) {
      if (validationCheckClient()) {
        dispatch(register(form));
        if (navigateLogin) {
          setForm({
            name: "",
            email: "",
            password: "",
          });
        }
      }
    } else {
      if (validationCheckVendor()) {
        dispatch(registerVendor(formV));
        if (navigateLogin) {
          setFormV({
            name: "",
            email: "",
            password: "",
            categories: "",
          });
        }
      }
    }
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
            <h2>Join Us As</h2>
            <button style={customStyles.button} onClick={handleClient}>
              Client
            </button>
            <button style={customStyles.button} onClick={handleVendor}>
              Vendor
            </button>
          </Modal>
          {client === true ? (
            <>
              <div className="containerRegister">
                <h1>Register Here</h1>
                <form className="boxR">
                  <legend>Username</legend>
                  <input
                    type="text"
                    value={form.name}
                    name="name"
                    onChange={inputHandlerC}
                  />
                  <legend>Email</legend>
                  <input
                    type="text"
                    value={form.email}
                    name="email"
                    onChange={inputHandlerC}
                  />
                  <legend>Password</legend>
                  <input
                    type="password"
                    value={form.password}
                    name="password"
                    onChange={inputHandlerC}
                  />
                  <button onClick={handleOnClick}>Register</button>
                </form>
                <span>
                  Already have an account?
                  <Link to="/login" className="aBtn">
                    Login
                  </Link>
                </span>
              </div>
            </>
          ) : vendor === true ? (
            <>
              <div className="containerRegister">
                <h1>Register Here</h1>
                <form className="boxR">
                  <legend>Username</legend>
                  <input
                    type="text"
                    value={formV.name}
                    name="name"
                    onChange={inputHandlerV}
                  />
                  <legend>Email</legend>
                  <input
                    type="text"
                    value={formV.email}
                    name="email"
                    onChange={inputHandlerV}
                  />
                  <legend>Password</legend>
                  <input
                    type="password"
                    value={formV.password}
                    name="password"
                    onChange={inputHandlerV}
                  />
                  <legend>Category</legend>
                  <select
                    name="categories"
                    value={formV.categories}
                    onChange={inputHandlerV}
                  >
                    <option value="">Choose a category</option>
                    <option value="food">Food</option>
                    <option value="medical">Medical</option>
                  </select>
                  <button onClick={handleOnClick}>Register</button>
                </form>
                <span>
                  Already have an account?
                  <Link to="/login" className="aBtn">
                    Login
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

export default Register;
