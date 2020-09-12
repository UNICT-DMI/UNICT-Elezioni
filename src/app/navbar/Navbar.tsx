import React, { FunctionComponent } from 'react';
import './Navbar.scss';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar: FunctionComponent = () => {
  return (
    <div className="Navbar">
      <nav className="navbar">
        <div className="navbar-brand">
          <a className="navbar-el" href="#" id="navbar-brand">UNICT-Elezioni</a>
          <FontAwesomeIcon icon={faGithub} className="navbar-el" />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
