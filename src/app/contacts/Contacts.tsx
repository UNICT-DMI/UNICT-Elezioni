import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './Contacts.scss';
//import { useParams } from 'react-router-dom';
// import Collapse from 'react-bootstrap/esm/Collapse';
// import Button from 'react-bootstrap/esm/Button';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Contacts = () => {

  return (
    <div className="Contacts">
      <div className="container-fluid">
        <h2 className="mt-5">Contatti</h2>
        <h2 className="mt-5">Questo progetto è stato realizzato da:</h2>
        <ListGroup variant="flush">
            <ListGroup.Item>Stefano Borzì</ListGroup.Item>
            <ListGroup.Item>Vincenzo Filetti</ListGroup.Item>
            <ListGroup.Item>Andrea Maugeri</ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}

export default Contacts;
