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

const Department = () => {
  const params: Params = useParams();
  const [show, setShow] = useState(false);

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
          {years.map(y => <Results key={`${y}-${params.dipartimento}`} anno={y} path={`dipartimenti/${params.dipartimento}`} details={true} />)}
        </div>
      </div>
    </div>
  );
}

export default Department;
