import React, { FunctionComponent } from 'react';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Menu: FunctionComponent = () => {
  return (

    <div className="Menu">

      <Navbar expand="lg" className="bg-navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container">
          <Navbar.Brand href="#/senato">UNICT Elezioni</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#/senato">Senato</Nav.Link>
              <Nav.Link href="#/cda">Consiglio di Amministrazione</Nav.Link>
              <Nav.Link href="#/dipartimenti">Dipartimenti</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              <Nav.Link href="https://github.com/UNICT-DMI/UNICT-elezioni" target="_blank">
                GitHub&nbsp;<FontAwesomeIcon icon={faGithub} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </div>
  );
}

export default Menu;
