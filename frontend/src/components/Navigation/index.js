import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import * as sessionActions from "../../store/session";
import logo from "../../assets/Logo.png";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className="li-links">
        <ProfileButton user={sessionUser} />
        <button onClick={logout} className="logout-btn">
          Log out
        </button>
      </li>
    );
  } else {
    sessionLinks = (
      <li className="li-links">
        <NavLink to="/login">Log in</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    );
  }

  return (
    <div className="Navigation">
      <div className="logo">
        <NavLink exact to="/">
          <img
            src={logo}
            alt="Logo for the company CozyNest"
            style={{ width: "150px", height: "140px" }}
          ></img>
        </NavLink>
      </div>
      <ul className="navLinks">
        <li>
          <div className="nav-a">
            <NavLink exact to="/">
              Home
            </NavLink>
          </div>
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </div>
  );
}

export default Navigation;
