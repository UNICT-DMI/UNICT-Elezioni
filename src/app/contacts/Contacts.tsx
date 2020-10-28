import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { faGithub, faLinkedin, faTelegramPlane } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Contacts.scss';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface ContactDetails {
  nominativo: string;
  telegram: string;
  github: string;
  email: string;
  linkedin?: string;
}

const Contact = (props: ContactDetails): JSX.Element => {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      {props.nominativo}
      <span className="badge-pill">
        <Button href={`https://t.me/${props.telegram}`} target="_blank">
          <div>
            <FontAwesomeIcon icon={faTelegramPlane} />
          </div>
        </Button>{' '}

        <Button href={props.email} target="_blank">
          <FontAwesomeIcon icon={faEnvelope} />
        </Button>{' '}

        {props?.linkedin && (<Button href={props.linkedin} target="_blank">
          <FontAwesomeIcon icon={faLinkedin} />
        </Button>)}
        {props?.linkedin && ' '}

        <Button href={`https://github.com/${props.github}`} target="_blank">
          <FontAwesomeIcon icon={faGithub} />
        </Button>{' '}
      </span>

    </ListGroup.Item>
  );
};

const Contacts = (): JSX.Element => {
  return (
    <div className="Contacts">
      <div className="container-fluid">
        <h2 className="mt-5">Contatti</h2>
        <h2 className="mt-5">Questo progetto è stato realizzato da:</h2>
        <ListGroup className="contributors">

          <Contact
            nominativo="Stefano Borzì"
            telegram="Helias"
            email="stefanoborzi32@gmail.com"
            linkedin="https://www.linkedin.com/in/stefanoborzi"
            github="Helias"></Contact>

          <Contact
            nominativo="Vincenzo Filetti"
            telegram="Veenz"
            email="vzfiletti@gmail.com"
            linkedin="https://www.linkedin.com/in/vincenzo-filetti-b87016103/"
            github="Veeenz"></Contact>

          <Contact
            nominativo="Andrea Maugeri"
            telegram="v0lp3"
            email="andreamaujeri@gmail.com"
            github="v0lp3"></Contact>

          <Contact
            nominativo="Graziano Di Grande"
            telegram="Adrenoid"
            email="graziano27dg@gmail.com"
            linkedin="https://www.linkedin.com/in/graziano-di-grande-47b077193/"
            github="drendog"></Contact>

          <Contact
            nominativo="Luigi Seminara"
            telegram="Gigii_G"
            email="seminara.luigi@gmail.com"
            github="Gigi-G"></Contact>

          <Contact
            nominativo="Davide Carnemolla"
            telegram="herbrant"
            email="cdavide98carnemolla@gmail.com"
            linkedin="https://www.linkedin.com/in/davide-carnemolla"
            github="herbrant"></Contact>
        </ListGroup>
      </div>
    </div>
  );
};

export default Contacts;
