import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './Contacts.scss';

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
            <ListGroup.Item>Graziano Di Grande</ListGroup.Item>
            <ListGroup.Item>Luigi Seminara</ListGroup.Item>
            <ListGroup.Item>Davide Carnemolla</ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}

export default Contacts;
