import React, { FunctionComponent } from 'react';
import './Navbar.scss';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar: FunctionComponent = () => {
  return (
      <nav className="navbar">
        <div className="navbar-brand">
          <a className="navbar-el" href="https://github.com/UNICT-DMI/UNICT-Elezioni" id="navbar-brand">UNICT-Elezioni</a>
          <FontAwesomeIcon icon={faGithub} className="navbar-el" />
        </div>
      </nav>
  );
}
export default Navbar;
