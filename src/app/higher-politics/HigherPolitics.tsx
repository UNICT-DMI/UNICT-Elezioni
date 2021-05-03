import React from 'react';
import { datareader } from '../../data/DataReader';
import Results from '../results/Results/Results';

interface Props {
  title: string;
  path: string;
}

function getResults(path: string): JSX.Element[] {
  return datareader.getYears().map((year: string): JSX.Element => {
    if (datareader.getEntity(year, path)) {
      return (
        <Results
          key={`Results-${year}-${path}`}
          anno={year}
          entity="organi superiori"
          subEntity={path}
          path={path}
          details={false} />
      );
    }
    return (<></>);
  });
}

function HigherPolitics(props: Props): JSX.Element {
  return (
    <div className="HigherPolitics">
      <h2 className="mt-5">{props.title}</h2>
      <div className="py-4">
        {getResults(props.path)}
      </div>
    </div>
  );
}

export default HigherPolitics;
