import React from 'react';
import { useParams } from 'react-router-dom';
import './Department.scss';
import { years } from '../../data/years';
import Results from '../results/Results/Results';

interface Params {
  dipartimento: string;
}

export type dict = { [key: string]: string[] };

const Department = (): JSX.Element => {
  const params: Params = useParams();

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

  return (
    <div className="Department">
      <div className="container-fluid">
        <h2 className="mt-5">{params.dipartimento.replace(/_/g, ' ')}</h2>
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
