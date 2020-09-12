import React, { FunctionComponent } from 'react';
import './Navbar.scss';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar: FunctionComponent = () => {
  return (
    <div className="Navbar">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">UNICT-Elezioni</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor01">
            <div className="navbar-nav mr-auto"></div>
            <a href="https://github.com/UNICT-DMI/UNICT-elezioni" target="_blank">
              <span className="text-white">GitHub</span>
              <button className="btn-empty">
                <FontAwesomeIcon icon={faGithub} />
              </button>
            </a>
          </div>

        </div>
      </nav>
    </div>
  );
}

export default Navbar;
