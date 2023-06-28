import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
// import * as sessionActions from "../../store/session";
import LoginFormPage from "../LoginFormPage";
import SignUpFormPage from "../SignUpPage";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  // const dispatch = useDispatch();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showModalBackground, setShowModalBackground] = useState(false); // New state variable

  // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(sessionActions.logout());
  // };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowModalBackground(true); // Set showModalBackground to true
    document.body.style.overflow = "hidden"; // Prevent scroll
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setShowModalBackground(false); // Set showModalBackground to false
    document.body.style.overflow = "auto"; // Restore scroll
  };

  const openSignUpModal = () => {
    setShowSignUpModal(true);
    setShowModalBackground(true); // Set showModalBackground to true
    document.body.style.overflow = "hidden"; // Prevent scroll
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
    setShowModalBackground(false); // Set showModalBackground to false
    document.body.style.overflow = "auto"; // Restore scroll
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <li>
          <div className="nav-a">
            <NavLink exact to="/">
              Create a New Spot
            </NavLink>
          </div>
        </li>
        <li className="li-links">
          <ProfileButton user={sessionUser} />
        </li>
      </>
    );
  }

  return (
    <div className="Navigation">
      <div className="company-name">
        <NavLink exact to="/">
          <h1>COZY NEST</h1>
        </NavLink>
      </div>
      <ul className="navLinks">
        {isLoaded && sessionLinks}
        {!sessionUser && (
          <>
            <li>
              <button onClick={openLoginModal} className="login-btn">
                Log in
              </button>
            </li>
            <li>
              <button onClick={openSignUpModal} className="signup-btn">
                Sign Up
              </button>
            </li>
          </>
        )}
      </ul>

      {showModalBackground && <div className="modal-background"></div>}

      {showLoginModal && (
        <div className={`${showModalBackground === false ? "modal-hidden" : "modal"}`}>
          <div className="modal-content">
            <span className="close" onClick={closeLoginModal}>
              &times;
            </span>
            <LoginFormPage closeModal={closeLoginModal} />
          </div>
        </div>
      )}

      {showSignUpModal && (
        <div className={`${showSignUpModal === false ? "modal modal-hidden" : "modal"}`}>
          <div className="modal-content">
            <span className="close" onClick={closeSignUpModal}>
              &times;
            </span>
            <SignUpFormPage closeModal={closeSignUpModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
