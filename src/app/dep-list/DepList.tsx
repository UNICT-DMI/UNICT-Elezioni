import React, { useState } from 'react';
import departments from '../../data/departments';
import Results from '../results/Results/Results';
import { years } from '../../data/years';
import { Button } from 'react-bootstrap';

const DepList = (): JSX.Element => {
  const depsPerPage = 5;
  const [next, setNext] = useState(depsPerPage);

  function handleShowMore(): void {
    setNext(next + depsPerPage);
  }

  return (
    <div className="Departments">
      <h2 className="mt-5">Dipartimenti</h2>
      {
        departments.slice(0, next).map((d) => [
          <hr className="my-5" key={`hr${d}`} />,
          <h3 key={`h3${d}`}><a href={`#/dipartimento/${d}`}>{d.replace(/_/g, ' ')}</a></h3>,
          years.map((y) => <Results anno={y} path={`dipartimenti/${d}`} details={false} key={`${d}${y}`} showDetailsList />)
        ])
      }
      {
        next < departments.length &&
        <Button onClick={handleShowMore} size="lg" block>
          Load more
        </Button>
      }
    </div >
  );
};

export default DepList;
