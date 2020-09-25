import React, { useState } from 'react';
import './Department.scss';
import { years } from '../../data/years';
import Results from '../results/Results';
import { useParams } from 'react-router-dom';
import Collapse from 'react-bootstrap/esm/Collapse';
import Button from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface Params {
  dipartimento: string;
}

export type dict = { [key: string]: string[] };

const Department = () => {
  const params: Params = useParams();
  const [show, setShow] = useState(false);

  // { year: seggi } -> { "2018-2020": ['1','2','3'] }
  const seggi: dict = {};
  const multi_dip_seggio: dict = {};

  years.forEach(y => {
    const seggio_per_year: dict = require(`../../data/${y}/seggi.json`);

    seggi[y] = [];
    multi_dip_seggio[y] = [];

    for (let s of Object.keys(seggio_per_year)) {
      if (seggio_per_year[s].includes(params.dipartimento)) {
        seggi[y].push(s);

        if (seggio_per_year[s].length > 1) {
          seggio_per_year[s].forEach(d => multi_dip_seggio[y].push(d));
        }
      }
    }

    // remove duplicates
    multi_dip_seggio[y] = Array.from(new Set(multi_dip_seggio[y]));
  });

  function toggleFormula(e: any) {
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
            <FontAwesomeIcon icon={faInfoCircle} /> &nbsp; &nbsp; Eleggibilità &nbsp; &nbsp; <FontAwesomeIcon icon={faInfoCircle} />
          </h3>
        </Button>

        <Collapse in={show}>
          <div id="collapse-formula" className="mt-3">
            <img src='formula.png' width="400" key="formula" alt="formula" />
          </div>
        </Collapse>

        <div className="mt-5">
          {years.map(y => <Results
            key={`${y}-${params.dipartimento}`}
            anno={y}
            path={`dipartimenti/${params.dipartimento}`}
            details={true} />
          )}
        </div>

        <div className="mt-5">
          <h2>Senato</h2>
          {years.map(y => <Results
            key={`${y}-${params.dipartimento}`}
            anno={y}
            path={`Senato`}
            seggio={seggi}
            multi_dip={multi_dip_seggio}
            details={true} />
          )}
        </div>

        <div className="mt-5">
          <h2>Consiglio di Amministrazione</h2>
          {years.map(y => <Results
            key={`${y}-${params.dipartimento}`}
            anno={y}
            path={`Consiglio_di_amministrazione`}
            seggio={seggi}
            multi_dip={multi_dip_seggio}
            details={true} />
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Department;
