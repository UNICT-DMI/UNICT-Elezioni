import React, { FunctionComponent } from 'react';
import './Container.scss';
import { faDemocrat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Container: FunctionComponent = () => {
  return (
    <div className="container-body">
      <h3><FontAwesomeIcon icon={faDemocrat} /> Risultati elezioni </h3>
      <ul>
        <li><button className="btn-grad">Dipartimento & CdL</button></li>
        <li><button>Organi superiori</button></li>
      </ul>
    </div>
  );
}

export default Container;
