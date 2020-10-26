import React, { FunctionComponent } from 'react';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from 'react-bootstrap/Navbar';

const Footer: FunctionComponent = () => (
  <div className="Footer mt-5">
    <Navbar expand="lg" className="bg-navbar navbar-expand-lg navbar-dark bg-primary fixed-bottom">
      <div className="container">
        <Navbar.Brand href="#">
          <FontAwesomeIcon icon={faCopyright} /> Powered by <a className="text-white" href="https://dmiinsider.github.io">DMI Insider</a>
        </Navbar.Brand>
      </div>
    </Navbar>
  </div>
);

export default Footer;
