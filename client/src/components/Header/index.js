import React from "react";
import { Link } from "react-router-dom";
import '../../styles/Header.scss';

import Auth from "../../utils/auth";

const Header = () => {
  // logout function for users to logout if logged in
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="header">
      <div className="branding">
        <Link to="/story">
          <h1 className="logo">Page Counter</h1>
        </Link>
      </div>
      <div className="nav-links-container">
        <Link to="/">Feed</Link>
        <Link to="/search">Search</Link>
        {Auth.loggedIn() ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/worms">Worms</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/logout" onClick={logout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;