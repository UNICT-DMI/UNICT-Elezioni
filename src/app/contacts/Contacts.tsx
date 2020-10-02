import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { faGithub, faLinkedin, faTelegramPlane } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Contacts.scss';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Contacts = () => {

  return (
    <div className="Contacts">
      <div className="container-fluid">
        <h2 className="mt-5">Contatti</h2>
        <h2 className="mt-5">Questo progetto è stato realizzato da:</h2>
        <ListGroup className="contributors">
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Stefano Borzì
              <span className="badge-pill">
              <Button href="https://t.me/Helias" target="_blank">
                <div>
                <FontAwesomeIcon icon={faTelegramPlane} />
                </div>
              </Button>{' '}

              <Button href="stefanoborzi32@gmail.com" target="_blank">
                <FontAwesomeIcon icon={faEnvelope} />
              </Button>{' '}

              <Button href="https://linkedin.com/in/stefanoborzi/" target="_blank">
                <FontAwesomeIcon icon={faLinkedin} />
              </Button>{' '}

              <Button href="https://github.com/Helias" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
              </Button>{' '}
              </span>
            
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Vincenzo Filetti

              <span className="badge-pill">
              <Button href="https://t.me/Veenz" target="_blank">
                <FontAwesomeIcon icon={faTelegramPlane} />
              </Button>{' '}

              <Button href="vzfiletti@gmail.com" target="_blank">
                <FontAwesomeIcon icon={faEnvelope} />
              </Button>{' '}

              <Button href="https://www.linkedin.com/in/vincenzo-filetti-b87016103/" target="_blank">
                <FontAwesomeIcon icon={faLinkedin} />
              </Button>{' '}

              <Button href="https://github.com/Veeenz" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
              </Button>{' '}
              </span>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Andrea Maugeri

              <span className="badge-pill">
              <Button href="https://t.me/v0lp3" target="_blank">
                <FontAwesomeIcon icon={faTelegramPlane} />
              </Button>{' '}

              <Button href="andreamaujeri@gmail.com" target="_blank">
                <FontAwesomeIcon icon={faEnvelope} />
              </Button>{' '}

              <Button href="https://github.com/v0lp3" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
              </Button>{' '}
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Graziano Di Grande

              <span className="badge-pill">
              <Button href="https://t.me/Adrenoid" target="_blank">
                <FontAwesomeIcon icon={faTelegramPlane} />
              </Button>{' '}

              <Button href="graziano27dg@gmail.com" target="_blank">
                <FontAwesomeIcon icon={faEnvelope} />
              </Button>{' '}

              <Button href="https://www.linkedin.com/in/graziano-di-grande-47b077193/" target="_blank">
                <FontAwesomeIcon icon={faLinkedin} />
              </Button>{' '}

              <Button href="https://github.com/drendog" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
              </Button>{' '}
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Luigi Seminara

              <span className="badge-pill">
              <Button href="https://t.me/Gigii_G" target="_blank">
                <FontAwesomeIcon icon={faTelegramPlane} />
              </Button>{' '}

              <Button href="seminara.luigi@gmail.com" target="_blank">
                <FontAwesomeIcon icon={faEnvelope} />
              </Button>{' '}

              <Button href="https://github.com/Gigi-G" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
              </Button>{' '}
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Davide Carnemolla

              <span className="badge-pill">
              <Button href="https://t.me/herbrant" target="_blank">
                <FontAwesomeIcon icon={faTelegramPlane} />
              </Button>{' '}

              <Button href="cdavide98carnemolla@gmail.com" target="_blank">
                <FontAwesomeIcon icon={faEnvelope} />
              </Button>{' '}

              <Button href="https://www.linkedin.com/in/davide-carnemolla" target="_blank">
                <FontAwesomeIcon icon={faLinkedin} />
              </Button>{' '}

              <Button href="https://github.com/herbrant" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
              </Button>{' '}
              </span>
            </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}

export default Contacts;
