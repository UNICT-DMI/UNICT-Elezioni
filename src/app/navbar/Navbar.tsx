import React, { FunctionComponent } from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navbar.scss';

const Menu: FunctionComponent = () => (
  <div className="Menu">
    <Navbar expand="lg" className="bg-navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container">
        <Navbar.Brand href="#/senato">
          <a href="https://dmiinsider.github.io">
            <img src="dmiinsider.svg" className="dmi-insider" />
          </a>
          &nbsp; UNICT Elezioni
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav variant="pills" activeKey="1">
            <NavDropdown title="Organi Superiori" id="nav-dropdown">
              <NavDropdown.Item href="#/senato">Senato</NavDropdown.Item>
              <NavDropdown.Item href="#/cda">Consiglio di Amministrazione</NavDropdown.Item>
              <NavDropdown.Item href="#/ersu">Consiglio di Amministrazione ERSU</NavDropdown.Item>
              <NavDropdown.Item href="#/ndv">Nucleo di Valutazione</NavDropdown.Item>
              <NavDropdown.Item href="#/csu">Comitato per lo sport Universitario</NavDropdown.Item>
              <NavDropdown.Item href="#/facolta_medicina">Coordinamento Facoltà di Medicina</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Dipartimento" id="nav-dropdown">
              <NavDropdown.Item href="#/dipartimenti">Consiglio di Dipartimento</NavDropdown.Item>
              <NavDropdown.Item href="#/dipartimenti-dottorandi">Consiglio di Dipartimento (Dottorandi)</NavDropdown.Item>
              <NavDropdown.Item href="#/cdl">Consiglio di Corso di Laurea</NavDropdown.Item>
              <NavDropdown.Item href="#/cdl-500">Consiglio di Corso di Laurea &lt;500</NavDropdown.Item>
            </NavDropdown>
          </Nav>
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
