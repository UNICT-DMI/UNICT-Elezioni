import React, { FunctionComponent, useState } from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faAddressCard, faGraduationCap, faSearch, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navbar.scss';
import { SearchForm } from '../search/SearchForm';

const Menu: FunctionComponent = () => {
  const [showSearch, setShowSearch] = useState(true);
  const searchTop = {
    top: (showSearch ? 0 : 70)
  };
  return (
    <div className="Menu">
      <Navbar expand="lg" className="bg-navbar navbar-expand-lg navbar-primary bg-primary fixed-top">
        <div className="container">
          <Navbar.Brand href="#/home">
            <img src="UNICT-Elezioni.png"
              className="border border-dark rounded-circle"
              height="30px"
              alt="UNICT Elezioni" />
              &nbsp; UNICT Elezioni
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" variant="pills" activeKey="1">
              <NavDropdown title={<><FontAwesomeIcon icon={faUniversity} />&nbsp;Organi Superiori</>} id="nav-dropdown">
                <NavDropdown.Item href="#/senato">Senato</NavDropdown.Item>
                <NavDropdown.Item href="#/cda">Consiglio di Amministrazione</NavDropdown.Item>
                <NavDropdown.Item href="#/ersu">Consiglio di Amministrazione ERSU</NavDropdown.Item>
                <NavDropdown.Item href="#/ndv">Nucleo di Valutazione</NavDropdown.Item>
                <NavDropdown.Item href="#/csu">Comitato per lo sport Universitario</NavDropdown.Item>
                <NavDropdown.Item href="#/facolta_medicina">Coordinamento Facoltà di Medicina</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={<><FontAwesomeIcon icon={faGraduationCap} />&nbsp;Dipartimento</>} id="nav-dropdown">
                <NavDropdown.Item href="#/dipartimenti">Consiglio di Dipartimento</NavDropdown.Item>
                <NavDropdown.Item href="#/dipartimenti-dottorandi">Consiglio di Dipartimento (Dottorandi)</NavDropdown.Item>
                <NavDropdown.Item href="#/cdl">Consiglio di Corso di Laurea</NavDropdown.Item>
                <NavDropdown.Item href="#/cdl-500">Consiglio di Corso di Laurea &lt;500</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#/contatti">
                <FontAwesomeIcon icon={faAddressCard} />
                &nbsp;Contatti
              </Nav.Link>
              <Nav.Link href="https://github.com/UNICT-DMI/UNICT-elezioni" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
              &nbsp;GitHub
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Nav.Link className="text-dark" onClick={(): void => setShowSearch(!showSearch)} href="#">
            <FontAwesomeIcon icon={faSearch} />
          </Nav.Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </div>
      </Navbar>
      <div className="container search-form" style={searchTop}>
        <SearchForm />
      </div>
    </div>
  );
};

export default Menu;
