import React, { FunctionComponent } from 'react';
import './Navbar.scss';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

const Menu: FunctionComponent = () => {
  return (

    <div className="Menu">

      <Navbar expand="lg" className="bg-navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Navbar.Brand href="#/senato">UNICT Elezioni</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#/senato">Senato</Nav.Link>
              <Nav.Link href="#/cda">Consiglio di Amministrazione</Nav.Link>
              <Nav.Link href="#/dipartimenti">Dipartimenti</Nav.Link>
            </Nav>
            <div className="collapse navbar-collapse" id="navbarColor01">
             <div className="navbar-nav mr-auto"></div>
             <a href="https://github.com/UNICT-DMI/UNICT-elezioni" target="_blank" rel="noopener noreferrer">
               <span className="text-white">GitHub</span>
               <Button className="btn-empty">
                 <FontAwesomeIcon icon={faGithub} />
               </Button>
             </a>
           </div>
          </Navbar.Collapse>
        </div>
      </Navbar>
     </div>
  );
}

export default Menu;
