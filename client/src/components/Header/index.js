import React from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import "../../styles/Header.scss";

import MobileNav from '../MobileNav';
import Auth from "../../utils/auth";

const Header = () => {
  // logout function for users to logout if logged in
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  const isMobile = useMediaQuery("(max-width: 810px)");

  return (
    <header className="header">
      <div className="branding">
        <Link to="/" className="link-text">
          <h1 className="logo">Page Counter</h1>
        </Link>
      </div>
      <div
        className={`nav-links-container`}
      >
        <Link to="/search">Search</Link>

        {Auth.loggedIn() ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/worms">Worms</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/story">Story</Link>
            <Link to="/" onClick={logout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/story">Story</Link>
          </>
        )}
      </div>
      <div className="mobile-div">{isMobile && <MobileNav />}</div>
    </header>
  );
};

export default Header;
