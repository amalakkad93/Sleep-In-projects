import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faBars,
  faCalendarAlt,
  faToolbox,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import UserBookings from "../Booking/UserBookings";

import "./ProfileButton.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();
  const userInitials =
    user && `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

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

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const ulClassName = "profile-dropdown";

  return (
    <>
      <div className="profile-dropdown-container">
        <div className="btn">
          <button
            className="navigation-btn"
            aria-label="Main navigation menu"
            onClick={openMenu}
          >
            {!user ? (
              <>
                <FontAwesomeIcon icon={faBars} className="menu-icon" />
                <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faBars} className="menu-icon" />
                <div className="user-initials1">
                  {userInitials.toUpperCase()}
                </div>
              </>
            )}
          </button>
        </div>
        <div className="menu-drop-down">
          <ul
            className={ulClassName}
            ref={ulRef}
            style={{ display: showMenu ? "block" : "none" }}
          >
            {user ? (
              <>
                <li className="center-menu greeting">
                  Hello, {user.firstName}
                </li>
                <li className="center-menu email">{user.email}</li>
                <hr />
                <ul className="center-menu">
                  <Link
                    to="/users/show"
                    onClick={closeMenu}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      style={{ marginRight: "8px" }}
                    />
                    <li className="center-menu center-menu-profile">
                      Your Profile
                    </li>
                  </Link>
                </ul>
                <ul className="center-menu">
                  <Link
                    to="/user/bookings"
                    onClick={closeMenu}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      style={{ marginRight: "8px" }}
                    />
                    <li>Your Bookings</li>
                  </Link>
                </ul>
                {/* <ul className="center-menu">
                  <button
                    className="Manage-spot-button center-menu1"
                    onClick={(e) => {
                      closeMenu();
                      navigate("/owner/spots");
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faToolbox}
                      style={{ marginRight: "8px" }}
                    />
                    Manage Spots
                  </button>
                </ul>

                <ul className="center-menu">
                  <button
                    className="Manage-spot-button center-menu1"
                    onClick={(e) => {
                      closeMenu();
                      navigate("/user/reviews");
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ marginRight: "8px" }}
                    />{" "}

                    Manage Reviews
                  </button>
                </ul> */}

                <ul className="center-menu">
                  <Link
                    to="/owner/spots"
                    onClick={closeMenu}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      style={{ marginRight: "8px" }}
                    />
                    <li>Manage Spots</li>
                  </Link>
                </ul>

                <ul className="center-menu">
                  <Link
                    to="/user/reviews"
                    onClick={closeMenu}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ marginRight: "8px" }}
                    />
                    <li>Manage Reviews</li>
                  </Link>
                </ul>

                <ul>
                  <button
                    onClick={logout}
                    className="buttons center-menu center-menu1"
                  >
                    Log Out
                  </button>
                </ul>
              </>
            ) : (
              <>
                <ul className="center-menu center-menu-login">
                  <OpenModalMenuItem
                    className="center-menu"
                    itemText="Log In"
                    onItemClick={closeMenu}
                    modalComponent={<LoginFormModal />}
                  />
                </ul>
                <ul className="center-menu center-menu-signUp">
                  <OpenModalMenuItem
                    className="center-menu"
                    itemText="Sign Up"
                    onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                  />
                </ul>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ProfileButton;
