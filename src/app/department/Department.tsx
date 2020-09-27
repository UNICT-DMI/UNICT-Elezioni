import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Collapse, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './Department.scss';
import { years } from '../../data/years';
import Results from '../results/Results';

interface Params {
  dipartimento: string;
}

export type dict = { [key: string]: string[] };

const Department = (): JSX.Element => {
  const params: Params = useParams();
  const [show, setShow] = useState(false);

  // { year: seggi } -> { "2018-2020": ['1','2','3'] }
  const seggi: dict = {};
  const multiDipSeggio: dict = {};

  years.forEach((y) => {
    const seggioPerYear: dict = require(`../../data/${y}/seggi.json`);

    seggi[y] = [];
    multiDipSeggio[y] = [];

    for (const s of Object.keys(seggioPerYear)) {
      if (seggioPerYear[s].includes(params.dipartimento)) {
        seggi[y].push(s);

        if (seggioPerYear[s].length > 1) {
          seggioPerYear[s].forEach((d) => multiDipSeggio[y].push(d));
        }
      }
    }

    // remove duplicates
    multiDipSeggio[y] = Array.from(new Set(multiDipSeggio[y]));
  });

  function toggleFormula (e: any): void {
    e.preventDefault();
    setShow(!show);
  }

  return (
    <div className="Department">
      <div className="container-fluid">
        <h2 className="mt-5">{params.dipartimento.replace(/_/g, ' ')}</h2>

        <Button
          className="mt-4"
          onClick={toggleFormula}
          aria-controls="collapse-tbody"
          aria-expanded={show}>
          <h3 className="text-white">
            <FontAwesomeIcon icon={faInfoCircle} />
            {' '}
            &nbsp; &nbsp; Eleggibilità &nbsp; &nbsp;
            <FontAwesomeIcon icon={faInfoCircle} />
          </h3>
        </Button>

        <Collapse in={show}>
          <div id="collapse-formula" className="mt-3">
            <img src="formula.png" width="400" key="formula" alt="formula" />
          </div>
        </Collapse>

        <div className="mt-5">
          {years.map((y) => (
            <Results
              key={`${y}-${params.dipartimento}`}
              anno={y}
              path={`dipartimenti/${params.dipartimento}`}
              details
              showDetailsList />
          ))}
        </div>

        <div className="mt-5">
          <h2>Senato</h2>
          {years.map((y) => (
            <Results
              key={`${y}-${params.dipartimento}`}
              anno={y}
              path="Senato"
              seggio={seggi}
              multiDip={multiDipSeggio}
              details
              showDetailsList />
          ))}
        </div>

        <div className="mt-5">
          <h2>Consiglio di Amministrazione</h2>
          {years.map((y) => (
            <Results
              key={`${y}-${params.dipartimento}`}
              anno={y}
              path="Consiglio_di_amministrazione"
              seggio={seggi}
              multiDip={multiDipSeggio}
              details
              showDetailsList />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Department;
