import React, { useEffect } from 'react';
import { datareader } from '../../data/DataReader';
import Results from '../results/Results/Results';
import ResultsUninominal from '../results/ResultsUninominal/ResultsUninominal';
import ReactGA from 'react-ga';

interface Params {
  entity: string;
  subEntity: string;
}

const SubEntity = (params: Params): JSX.Element => {
  useEffect(() => {
    if (params.entity === 'organi superiori') {
      ReactGA.pageview(params.subEntity);
    }
  });

  return (
    <div className="mt-4">
      {
        datareader.getYearsOfSubEntity(params.entity, params.subEntity).map((year) => {
          if (datareader.isUninominal(year, params.entity, params.subEntity)) {
            return (
              <ResultsUninominal
                key={`${year}-${params.subEntity}`}
                year={year}
                entity={params.entity}
                subEntity={params.subEntity} />);
          }
          return (
            <Results
              key={`${year}-${params.subEntity}`}
              anno={year}
              entity={params.entity}
              subEntity={params.subEntity}
              path={`${params.subEntity}/${params.subEntity}`}
              details
              showDetailsList />
          );
        })}
    </div>
  );
};

export default SubEntity;
