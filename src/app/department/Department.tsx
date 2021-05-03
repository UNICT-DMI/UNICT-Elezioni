import React from 'react';
import { useParams } from 'react-router-dom';
import './Department.scss';
import { years } from '../../data/years';
import Results from '../results/Results/Results';
import { datareader } from '../../data/DataReader';

interface Params {
  dipartimento: string;
}

export type dict = { [key: string]: string[] };

const Department = (): JSX.Element => {
  const params: Params = useParams();

  return (
    <div className="Department">
      <div className="container-fluid">
        <h2 className="mt-5">{params.dipartimento.replace(/_/g, ' ')}</h2>
        <div className="mt-5">
          {years.map((y) => (
            <Results
              key={`${y}-${params.dipartimento}`}
              anno={y}
              entity="dipartimenti"
              subEntity={params.dipartimento}
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
              entity="organi superiori"
              subEntity="Senato"
              seggi={datareader.getSeatsId(y, params.dipartimento)}
              path="Senato"
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
              entity="organi superiori"
              subEntity="Consiglio_di_amministrazione"
              seggi={datareader.getSeatsId(y, params.dipartimento)}
              path="Consiglio_di_amministrazione"
              details
              showDetailsList />
          ))}
        </div>

        {/* <div className="mt-5">
          <h2>Consiglio di Amministrazione ERSU</h2>
            <Results
              key={`2019-2023-${params.dipartimento}`}
              anno="2019-2023"
              path="ERSU"
              seggio={seggi}
              multiDip={multiDipSeggio}
              details
              showDetailsList />
        </div> */}

        <div className="mt-5"></div>
        <div className="mt-5"></div>
      </div>
    </div>
  );
};

export default Department;
