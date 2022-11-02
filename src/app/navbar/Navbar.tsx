import React, { FunctionComponent, useState } from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faAddressCard, faGraduationCap, faSearch, faTimes, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navbar.scss';
import { SearchForm } from '../search/SearchForm';
import { Collapse } from 'react-bootstrap';
import { mdiVoteOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { datareader } from '../../data/DataReader';
import fixName from '../utils/FixName';

const Menu: FunctionComponent = () => {
  const [showSearch, setShowSearch] = useState(false);

  function higherPoliticsItems(): JSX.Element[] {
    return (
      datareader.getAllHigherPolitics().map((entity: string) => {
        return (
          <NavDropdown.Item href={`#/${entity}`} key={`NavItem-${entity}`}>{fixName(entity)}</NavDropdown.Item>
        );
      })
    );
  }

  function departmentItems(): JSX.Element[] {
    return (
      datareader.getEntities().filter((entity: string) => !entity.includes('organi superiori')).map((entity: string) => {
        return (
          <NavDropdown.Item href={`#/${entity}`} key={`NavItem-${entity}`}>Consiglio di {fixName(entity)}</NavDropdown.Item>
        );
      })
    );
  }

  return (
    <div className="Menu">
      <Navbar expand="lg" className="bg-navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container">
          <Navbar.Brand href="#/home">
            <Icon path={mdiVoteOutline} size={1.2} />
              &nbsp; UNICT Elezioni
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" variant="pills" activeKey="1">
              <NavDropdown title={<><FontAwesomeIcon icon={faUniversity} />&nbsp;Organi Superiori</>} id="nav-dropdown">
                {higherPoliticsItems()}
              </NavDropdown>
              <NavDropdown title={<><FontAwesomeIcon icon={faGraduationCap} />&nbsp;Dipartimento</>} id="nav-dropdown">
                {departmentItems()}
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
          <div className="row">
            <Nav.Link className="text-dark search-button"
              onClick={(): void => setShowSearch(!showSearch)}
              aria-controls="search-form"
              aria-expanded={showSearch}
              href="#">
              <FontAwesomeIcon icon={showSearch ? faTimes : faSearch} />
            </Nav.Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </div>
        </div>
      </Navbar>
      { showSearch ? (
        <Collapse in={showSearch}>
          <div className="container-fluid search-form pt-2">
            <div className="container">
              <SearchForm onClose={(): void => setShowSearch(false)} />
            </div>
          </div>
        </Collapse>
      ) : null }
    </div>
  );
};

export default Menu;
