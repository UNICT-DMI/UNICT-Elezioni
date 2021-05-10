import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { datareader } from '../../data/DataReader';
import SubEntity from '../sub-entity/SubEntity';
import fixName from '../utils/FixName';

interface Params {
  entity: string;
}

const SubEntityList = (params: Params): JSX.Element => {
  const entitiesPerPage = 5;
  const [next, setNext] = useState(entitiesPerPage);

  function handleShowMore(): void {
    setNext(next + entitiesPerPage);
  }

  function generateSubEntities(): JSX.Element[] {
    return datareader.getAllSubEntities(params.entity).map((subEntity: string) => {
      if (subEntity.includes('medicina')) {
        return (<></>);
      }
      return (
        <>
          <div className="sub-entity">
            <div className="container-fluid">
              <h3 className="mt-5 capitalize">
                <a href={`#/single/${params.entity}/${subEntity}`}>
                  {fixName(subEntity)}
                </a>
              </h3>
              <SubEntity key={`${params.entity}${subEntity}`} entity={params.entity} subEntity={subEntity} />
              <hr />
            </div>
          </div>
        </>
      );
    });
  }

  const subEntities = generateSubEntities();

  return (
    <>
      <h2 className="mt-5 capitalize">{params.entity}</h2>
      {
        subEntities.slice(0, next)
      }
      {
        next < subEntities.length &&
        <Button onClick={handleShowMore} size="lg" block>
          Load more
        </Button>
      }
    </>
  );
};

export default SubEntityList;
