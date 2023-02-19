import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/navbar.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <>
      <div className="Navbar">
        <Link to="/">
          <h2 className="nav-logo">Find-U</h2>
        </Link>
        <div className={`nav-items ${isOpen && "open"}`}>
          <Link onClick={() => setIsOpen(!isOpen)} to="/">
            HOME
          </Link>
          {isAuthenticated ? (
            user.role === "user" ? (
              <Link onClick={() => setIsOpen(!isOpen)} to="/allchat">
                ALL CHATS
              </Link>
            ) : (
              <Link onClick={() => setIsOpen(!isOpen)} to="/feedback">
                FEEDBACKS
              </Link>
            )
          ) : null}
        </div>
        <div
          className={`nav-toggle ${isOpen && "open"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ImCross fontSize={24} />
          ) : (
            <GiHamburgerMenu fontSize={27} />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
