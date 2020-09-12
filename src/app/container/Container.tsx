import React, { FunctionComponent } from 'react';
import './Container.scss';

const Container: FunctionComponent = () => {
  return (
    <div className="container-body">
      
      <h1>Risultati elezioni</h1>
      <ul>
        <li><button>Dipartimento & CdL</button></li>
        <li><button>Organi superiori</button></li>
      </ul>
    </div>
  );
}

export default Container;
