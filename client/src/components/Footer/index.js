import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.scss";

import { FaGithub, FaLinkedin, FaList, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-auto p-4">
      <div className="footer-div">
        <ul>
          <li>
            <a href="https://github.com/Vincenttoon">
              <FaGithub fontSize={"2em"} />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/vincent-toon-4954b6162/">
              <FaLinkedin fontSize={"2em"} />
            </a>
          </li>
          <li>
            <a href="https://vincent-toon-portfolio.vercel.app/">
              <FaList fontSize={"2em"} />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/vince.toon">
              <FaFacebook fontSize={"2em"} />
            </a>
          </li>
        </ul>
        <div className="footer-message">
          <h4 className="foot-priv">
            <Link to="/privacyAndTerms">Privacy & Terms</Link>
          </h4>
          <h2 className="foot-star">|</h2>
          <h4>Created 2023 by Vincent Toon</h4>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
