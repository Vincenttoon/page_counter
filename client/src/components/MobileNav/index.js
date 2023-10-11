import { React, useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Auth from "../../utils/auth";

const MobileNav = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <div className="mobile-nav-div">
      <MenuIcon
        id="mobile-nav-menu"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{ fontSize: "2rem" }}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {Auth.loggedIn() ? (
          <>
            <MenuItem onClick={handleClose}>
              <NavLink to="/profile" className="mobile-nav-link">
                Profile
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/search" className="mobile-nav-link">
                Search
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/worms" className="mobile-nav-link">
                Worms
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/settings" className="mobile-nav-link">
                Settings
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/story" className="mobile-nav-link">
                Story
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/" className="mobile-nav-link" onClick={logout}>
                Logout
              </NavLink>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleClose}>
              <NavLink to="/login" className="mobile-nav-link">
                Login
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/signup" className="mobile-nav-link">
                Sign Up
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/search" className="mobile-nav-link">
                Search
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/story" className="mobile-nav-link">
                Story
              </NavLink>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
};

export default MobileNav;
