import React from 'react';
import Results from '../results/Results/Results';

interface Props {
  title: string;
  path: string;
}

function HigherPolitics(props: Props): JSX.Element {
  return (
    <div className="HigherPolitics">
      <h2 className="mt-5">{props.title}</h2>
      <div className="py-4">
        <Results anno="2018-2020" path={props.path} details={false} />
        <Results anno="2016-2018" path={props.path} details={false} />
        <Results anno="2014-2016" path={props.path} details={false} />
      </div>
    </div>
  );
}

export default HigherPolitics;
