import React, { useState } from 'react';
import departments from '../../data/departments';
import Results from '../results/Results/Results';
import { Button } from 'react-bootstrap';
import { datareader } from '../../data/DataReader';
import { Link } from 'react-router-dom';

const DepList = (): JSX.Element => {
  const depsPerPage = 5;
  const [next, setNext] = useState(depsPerPage);
  const years: string[] = datareader.getYears();

  function handleShowMore(): void {
    setNext(next + depsPerPage);
  }

  return (
    <div className="Departments">
      <h2 className="mt-5">Dipartimenti</h2>
      {
        datareader.getAllDepartments().slice(0, next).map((dep: string) => [
          <hr className="my-5" key={`hr${dep}`} />,
          <h3 key={`h3${dep}`}>
            <Link to={(location: any): string => `${location.pathname}/${dep}`}>
              {dep.replace(/_/g, ' ')}
            </Link>
          </h3>,
          years.map((year: string): JSX.Element => {
            return (
              datareader.getSubEntity(year, 'dipartimenti', dep) &&
              <Results
                anno={year}
                entity="dipartimenti"
                subEntity={dep}
                path={`dipartimenti/${dep}`}
                details={false}
                key={`${dep}${year}`}
                showDetailsList />
            );
          })
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
