import React from 'react';
import { datareader } from '../../data/DataReader';
import Results from '../results/Results/Results';
import ResultsUninominal from '../results/ResultsUninominal/ResultsUninominal';
import fixName from '../utils/FixName';

interface Params {
  entity: string;
  subEntity: string;
}

const SubEntity = (params: Params): JSX.Element => {
  return (
    <div className="sub-entity">
      <div className="container-fluid">
        <h3 className="mt-5 capitalize">{fixName(params.subEntity)}</h3>
        <div className="mt-5">
          {
            datareader.getYearsOfSubEntity(params.entity, params.subEntity).map((year) => {
              if (datareader.isUninominal(year, params.entity, params.subEntity)) {
                return (
                  <ResultsUninominal
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
      </div>
    </div>
  );
};

export default SubEntity;
