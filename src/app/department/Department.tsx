import React from 'react';
import './Department.scss';
import { years } from '../../data/years';
import Results from '../results/Results';
import { useParams } from 'react-router-dom';

interface Params {
  dipartimento: string;
}

const Department = () => {
  const params: Params = useParams();
  return (
    <div className="Department">
      <div className="container-fluid">
        <h3 className="mt-5">{params.dipartimento.replace(/_/g, ' ')}</h3>,
        {years.map(y => <Results key={`${y}-${params.dipartimento}`} anno={y} path={`dipartimenti/${params.dipartimento}`} />)}
      </div>
    </div>
  );
}

export default Department;
