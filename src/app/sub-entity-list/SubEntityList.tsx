import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { datareader } from '../../data/DataReader';
import SubEntity from '../sub-entity/SubEntity';
import fixName from '../utils/FixName';
import './SubEntityList.scss';
import { faList } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';

interface Params {
  entity: string;
}

const SubEntityList = (params: Params): JSX.Element => {
  ReactGA.pageview(window.location.hash);
  const entitiesPerPage = 5;
  const [next, setNext] = useState(entitiesPerPage);

  function handleShowMore(): void {
    setNext(next + entitiesPerPage);
  }

  function subEntitiesDropdown(): JSX.Element {
    return (
      <DropdownButton
        id="dropdown-entities"
        className="entities-rapid-access"
        title={<span><FontAwesomeIcon icon={faList} /> Accesso Rapido</span>}>
        {
          datareader.getAllSubEntities(params.entity).map((subEntity: string) => {
            return (
              <Dropdown.Item
                key={`dropdown-${subEntity}`}
                href={`#/single/${params.entity}/${subEntity}`}>
                <div className="capitalize">
                  {fixName(subEntity)}
                </div>
              </Dropdown.Item>
            );
          })
        }
      </DropdownButton>
    );
  }

  function generateSubEntities(): JSX.Element[] {
    return datareader.getAllSubEntities(params.entity).map((subEntity: string) => {
      if (subEntity.includes('medicina')) {
        return (<></>);
      }
      return (
        <>
          <div className="sub-entity">
            <h3 className="mt-5 capitalize">
              <a href={`#/single/${params.entity}/${subEntity}`}>
                {fixName(subEntity)}
              </a>
            </h3>
            <SubEntity key={`subentity-${params.entity}${subEntity}`} entity={params.entity} subEntity={subEntity} />
            <hr />
          </div>
        </>
      );
    });
  }

  const subEntities = generateSubEntities();

  return (
    <>
      <h2 className="mt-5 capitalize">{params.entity}</h2>
      <div className="container d-flex justify-content-end">
        {subEntitiesDropdown()}
      </div>
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
