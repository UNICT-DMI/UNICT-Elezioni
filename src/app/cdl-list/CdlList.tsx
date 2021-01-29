import React, { useState } from 'react';
import cdls from '../../data/cdl';
import Results from '../results/Results/Results';
import { Button } from 'react-bootstrap';

interface Props {
  year: string;
}

const CdlList = (props: Props): JSX.Element => {
  const cdlPerPage = 3;
  const cdlPerMore = 5;
  const [next, setNext] = useState(cdlPerPage);

  function handleShowMore(): void {
    setNext(next + cdlPerMore);
  }

  return (
    <div>
      <h2 className="mt-5" key={`h2${props.year}`}>Consiglio di Corso di Laurea {props.year}</h2>,
      {
        (cdls as any)[props.year].slice(0, next).map((c: string) => [
          <hr className="my-5" key={`hr${props.year}`} />,
          <h3 key={`h3${props.year}`}>{c.replace(/_/g, ' ')}</h3>,
          <Results anno={props.year} path={`cdl/${c}`} details={false} key={`${c}${props.year}`} showDetailsList />
        ])
      },
      {
        next < (cdls as any)[props.year].length &&
        <Button key={`loadmore${props.year}`} onClick={handleShowMore} size="lg" block>
          Load more [{props.year}]
        </Button>
      }
    </div>
  );
};

export default CdlList;
