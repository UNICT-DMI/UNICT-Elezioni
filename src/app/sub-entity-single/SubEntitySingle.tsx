import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { datareader } from '../../data/DataReader';
import Results from '../results/Results/Results';
import SubEntity from '../sub-entity/SubEntity';
import fixName from '../utils/FixName';
import ReactGA from 'react-ga';
import { Breadcrumb } from 'react-bootstrap';
import './SubEntitySingle.scss';

interface Params {
  entity: string;
  subEntity: string;
}

export function higherPolitics(): JSX.Element | JSX.Element[] {
  const params: Params = useParams();

  let hasHighPoliticsSeats = false;

  datareader.getYearsOfSubEntity(params.entity, params.subEntity).map((y) => {
    if (datareader.getSeatsId(y, params.subEntity) && datareader.getSeatsId(y, params.subEntity).length) {
      hasHighPoliticsSeats = true;
    }
  });

  if (!hasHighPoliticsSeats) {
    return (<></>);
  }
  return (
    <>
      <div className="mt-5">
        <h2>Senato</h2>
        {
          datareader.getYearsOfSubEntity(params.entity, params.subEntity).map((y) => (
            <Results
              key={`${y}-${params.subEntity}`}
              anno={y}
              entity="organi superiori"
              subEntity="Senato"
              seggi={datareader.getSeatsId(y, params.subEntity)}
              path="Senato"
              details />
          ))
        }
      </div>

      <div className="mt-5">
        <h2>Consiglio di Amministrazione</h2>
        {
          datareader.getYearsOfSubEntity(params.entity, params.subEntity).map((y) => (
            <Results
              key={`${y}-${params.subEntity}`}
              anno={y}
              entity="organi superiori"
              subEntity="Consiglio_di_amministrazione"
              seggi={datareader.getSeatsId(y, params.subEntity)}
              path="Consiglio_di_amministrazione"
              details />
          ))
        }
      </div>
    </>
  );
}

const SubEntitySingle = (): JSX.Element => {
  useEffect(() => {
    ReactGA.pageview(window.location.hash);
  });
  const params: Params = useParams();

  return (
    <>
      <div className="sub-entity">
        <div className="container-fluid">
          <Breadcrumb className="container">
            <Breadcrumb.Item href="#/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item href={`#/${params.entity}`}>
              {fixName(params.entity)}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{fixName(params.subEntity)}</Breadcrumb.Item>
          </Breadcrumb>
          <h3 className="mt-4 capitalize">{fixName(params.subEntity)}</h3>
          <SubEntity key={`${params.entity}${params.subEntity}`} entity={params.entity} subEntity={params.subEntity} />
          {/* {higherPolitics()} */}
        </div>
      </div>
    </>
  );
};

export default SubEntitySingle;
