import React, { FunctionComponent } from 'react';
import { faCopyright, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from 'react-bootstrap/Navbar';
import './Footer.scss';

const Footer: FunctionComponent = () => (
  <div className="Footer mt-5">
    <Navbar expand="lg" className="py-0 bg-navbar navbar-expand-lg navbar-primary bg-primary fixed-bottom">
      <div className="container">
        <Navbar.Brand>
          <div className="organization-credit my-0 text-light">
            <FontAwesomeIcon icon={faCopyright} />
            &nbsp;Powered by &nbsp;
            <a className="text-light" href="https://github.com/UNICT-DMI/">
              <FontAwesomeIcon icon={faUsers} /> UNICT-DMI
            </a>
          </div>
        </Navbar.Brand>
      </div>
    </Navbar>
  </div>
);

export default Footer;
