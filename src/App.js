import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/action";
import "./styles/register.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Allreq from "./pages/Allreq";
import Loader from "./components/Loader";
import Create from "./pages/Create";
import ChatVendor from "./pages/ChatVendor";
import Chat from "./pages/Chat";
import AllChat from "./pages/AllChat";
import Feedback from "./pages/Feedback";
import Vfeedback from "./pages/Vfeedback";

const App = () => {
  const { message, error, loading, user } = useSelector((state) => state.auth);
  let role;
  if (user) role = user && user.role;
  else {
    let userDe = JSON.parse(localStorage.getItem("user"));
    role = userDe && userDe.role;
  }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser(role));
  }, [dispatch, role]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message]);
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/allreq" element={<Allreq />} />
              <Route path="/create" element={<Create />} />
              {role === "vendor" ? (
                <Route path="/chat/user/:id" element={<ChatVendor />} />
              ) : (
                <Route path="/chat/vendor/:id" element={<Chat />} />
              )}
              {role === "vendor" ? null : (
                <Route path="/feedback/:id" element={<Feedback />} />
              )}
              {role === "vendor" ? (
                <Route path="/feedback" element={<Vfeedback />} />
              ) : null}
              <Route path="/allchat" element={<AllChat />} />
              <Route path="*" element={<div>Go Back</div>} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </>
        )}
      </BrowserRouter>
    </>
  );
};

export default App;
