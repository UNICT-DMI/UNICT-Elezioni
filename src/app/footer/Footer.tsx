import React, { FunctionComponent } from 'react';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from 'react-bootstrap/Navbar';

const Footer: FunctionComponent = () => (
  <div className="Footer mt-5">
    <Navbar expand="lg" className="py-0 bg-navbar navbar-expand-lg navbar-primary bg-primary fixed-bottom">
      <div className="container">
        <Navbar.Brand>
          <h6 className="my-0 text-dark">
            <FontAwesomeIcon icon={faCopyright} /> Powered by <a className="text-dark" href="https://github.com/UNICT-DMI/">UNICT-DMI</a>
          </h6>
        </Navbar.Brand>
      </div>
    </Navbar>
  </div>
);

export default Footer;
