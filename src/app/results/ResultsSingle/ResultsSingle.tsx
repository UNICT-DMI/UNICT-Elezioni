import React from 'react';
import { useParams } from 'react-router-dom';
import ResultsUninominal from '../ResultsUninominal/ResultsUninominal';

interface Params {
  anno: string;
  cdl: string;
  type: string;
}

export const ResultsSingle = (): JSX.Element => {
  const params: Params = useParams();

  return (
    <ResultsUninominal year={params.anno} entity={params.type} subEntity={params.cdl} />
  );
};

export default ResultsSingle;
