import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden hidden-menu");

  return (
    <div className="profile-nav">
      <button onClick={openMenu} className="icon-btn">
        <i class="fas fa-solid fa-bars" />
        <i className="fas fa-user-circle " />
      </button>
      <ul className={`${ulClassName} `} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.user.firstName}!</li>
            <li>{user.user.email}</li>
            <hr />
            <Link className="profile-btn-links" to="/my-spots">
              Manage Spots
            </Link>
            <Link className="profile-btn-links" to="/my-reviews">
              Manage Reviews
            </Link>
            <hr />
            <li>
              <button onClick={logout} className="profile-btn">
                Log out
              </button>
            </li>
          </>
        ) : (
          <li>Loading...</li> // Display a loading message while user data is being fetched
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
