import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import SearchBar from "../SearchBar";
import logo from "../../assets/logo/logo.jpg";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) =>
    state.spots.allSpots ? Object.values(state.spots.allSpots) : []
  );
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="navBar-container">
        <div className="navBar-inner-container">
          <div className="navBar-logo-create-link">
            <NavLink exact to="/" className="navbar-logo">
              <div className="logo-and-text">
                <img src={logo} alt="logo" className="logo" />
                <span className="logo-text">SleepInn</span>
              </div>
            </NavLink>
          </div>
          <div className="navBar-logo-create-link">
            <SearchBar spots={spots} />
            {sessionUser && (
              <div className="navBar-create-link">
                <NavLink to="/spots/new" className="create-new-spot">
                  Create a New Spot
                </NavLink>
              </div>
            )}
            {isLoaded && (
              <ul className="navBar-far-right">
                <li>
                  <ProfileButton user={sessionUser} showMenu={showMenu} />
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <hr className="line"></hr>
    </>
  );
}

export default Navigation;
