import React, { FunctionComponent } from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Menu: FunctionComponent = () => (
  <div className="Menu">
    <Navbar expand="lg" className="bg-navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container">
        <Navbar.Brand href="#/senato">UNICT Elezioni</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav variant="pills" activeKey="1">
            <NavDropdown title="Risultati" id="nav-dropdown">
              <NavDropdown.Item href="#/senato">Senato</NavDropdown.Item>
              <NavDropdown.Item href="#/cda">Consiglio di Amministrazione</NavDropdown.Item>
              <NavDropdown.Item href="#/ndv">Nucleo di Valutazione</NavDropdown.Item>
              <NavDropdown.Item href="#/csu">Comitato per lo sport Universitario</NavDropdown.Item>
              <NavDropdown.Item href="#/dipartimenti">Dipartimenti</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#/contatti">Contatti</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link href="https://github.com/UNICT-DMI/UNICT-elezioni" target="_blank">
              GitHub&nbsp;
              <FontAwesomeIcon icon={faGithub} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  </div>
);

export default Menu;
