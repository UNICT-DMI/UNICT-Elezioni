import { faChartBar, faGraduationCap, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ListLogo from '../results/ListLogo/ListLogo';
import { CandidateInfo, ListInfo, EntityInfo, searchEngine, SearchResult } from './SearchEngine';

interface Params {
  keywords: string;
}

export const SearchPage = (): JSX.Element => {
  const params: Params = useParams();
  const [entitiesSuggests, setEntitiesSuggests] = useState([] as EntityInfo[]);
  const [listSuggests, setListSuggests] = useState([] as ListInfo[]);
  const [candidatesSuggests, setCandidatesSuggests] = useState([] as CandidateInfo[]);

  useEffect(() => {
    const results: SearchResult = searchEngine.search(params.keywords);
    setEntitiesSuggests(results.entities);
    setListSuggests(results.lists);
    setCandidatesSuggests(results.candidates);
  }, [params]);

  function showResultsButton(url: string): JSX.Element {
    return (
      <Button href={url}>
        <FontAwesomeIcon icon={faChartBar} />
          &nbsp; Vedi risultati
      </Button>
    );
  }

  function generateEntitySuggests(): JSX.Element[] {
    return entitiesSuggests.map((suggestion) =>
      <div key={`dep-${suggestion}`} className="p-2">
        <Card>
          <Card.Body>
            <Card.Title>
              <FontAwesomeIcon icon={faGraduationCap} />
              <br />
              {suggestion.name.replaceAll('_', ' ')}
              <br />
            </Card.Title>
          </Card.Body>
        </Card>
      </div >
    ) as any;
  }

  function generateListSuggests(): JSX.Element[] {
    return listSuggests.map((suggestion) =>
      <div key={`list-${suggestion.name}${suggestion.entity}${suggestion.year}`}
        className="p-2">
        <Card>
          <Card.Body>
            <Card.Title>
              {suggestion.name}
            </Card.Title>
            <Card.Text>
              <div className="row">
                <div className="col my-auto">
                  <div className="float-right">
                    <ListLogo listName={suggestion.name} />
                  </div>
                </div>
                <div className="col my-auto">
                  <div className="float-left text-left">
                    Anno: {suggestion.year}
                    <br />
                    <FontAwesomeIcon icon={faGraduationCap} />&nbsp;
                    {suggestion.subEntity?.replaceAll('_', ' ')}
                    <br />
                    <FontAwesomeIcon icon={faUniversity} />&nbsp;
                    {suggestion.entity?.replaceAll('_', ' ')}
                  </div>
                </div>
              </div>
            </Card.Text>
            {showResultsButton('#/' + suggestion.path)}
          </Card.Body>
        </Card>
      </div>
    ) as any;
  }

  function generateCandidatesSuggests(): JSX.Element[] {
    return candidatesSuggests.map((suggestion) =>
      <div key={`list-${suggestion.name}${suggestion.entity}${suggestion.year}`}
        className="p-2">
        <Card>
          <Card.Body>
            <Card.Title>
              {suggestion.name}
            </Card.Title>
            <Card.Text>
              <div className="row">
                <div className="col my-auto">
                  <div className="float-right">
                    <ListLogo listName={suggestion.listName} />
                  </div>
                </div>
                <div className="col my-auto">
                  <div className="float-left text-left">
                    {
                      suggestion.listName &&
                      <div>
                        Lista: {suggestion.listName}
                        <br />
                      </div>
                    }
                    Anno: {suggestion.year}
                    <br />
                    <FontAwesomeIcon icon={faUniversity} />&nbsp;
                    {suggestion.entity.replaceAll('_', ' ')}
                  </div>
                </div>
              </div>
            </Card.Text>
            {showResultsButton('#/' + suggestion.path)}
          </Card.Body>
        </Card>
      </div>
    ) as any;
  }

  return (
    <div className="search-results">
      <h2>Ricerca di <i>{params.keywords}</i>:</h2>
      <div className="suggestions">
        {generateEntitySuggests()}
        {generateListSuggests()}
        {generateCandidatesSuggests()}
      </div>
    </div>
  );
};
