import React, { useState } from 'react';
import cdls from '../../data/cdl';
import Results from '../results/Results/Results';
import { years } from '../../data/years';
import { Button } from 'react-bootstrap';

const CdlList = (): JSX.Element => {
  const cdlPerPage = 5;
  const [next, setNext] = useState(cdlPerPage);

  function handleShowMore(): void {
    setNext(next + cdlPerPage);
  }

  return (
    <div className="cdls">
      {years.map((y) => [
        <hr key={`hr${y}`} />,
        <h2 className="mt-5" key={`h2${y}`}>Consiglio di Corso di Laurea {y}</h2>,
        (cdls as any)[y].slice(0, next).map((c: string) => [
          <hr className="my-5" key={`hr${c}`} />,
          <h3 key={`h3${c}`}>{c.replace(/_/g, ' ')}</h3>,
          <Results anno={y} path={`cdl/${c}`} details={false} key={`${c}${y}`} showDetailsList />
        ])
      ])}
      <Button onClick={handleShowMore} size="lg" block>Load more</Button>
    </div>
  );
};

export default CdlList;
