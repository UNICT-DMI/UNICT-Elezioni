import React from 'react';
import { useParams } from 'react-router-dom';
import { years } from '../../data/years';
import Results from '../results/Results/Results';

interface Params {
  cdl: string;
}

export type dict = { [key: string]: string[] };

const Cdl = (): JSX.Element => {
  const params: Params = useParams();

  return (
    <div className="Department">
      <div className="container-fluid">
        <h2 className="mt-5">{params.cdl.replace(/_/g, ' ')}</h2>

        <div className="mt-5">
          {years.map((y) => (
            <Results
              key={`${y}-${params.cdl}`}
              anno={y}
              entity="cdl"
              subEntity={params.cdl}
              path={`cdl/${params.cdl}`}
              details
              showDetailsList />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cdl;
