import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ListLogo from '../results/ListLogo/ListLogo';
import SearchEngine, { CandidateInfo, ListInfo } from './SearchEngine';

interface Params {
  keywords: string;
}

export const SearchPage = (): JSX.Element => {
  const params: Params = useParams();
  const [depSuggests, setDepSuggests] = useState([] as string[]);
  const [listSuggests, setListSuggests] = useState([] as ListInfo[]);
  const [candidatesSuggests, setCandidatesSuggests] = useState([] as CandidateInfo[]);

  useEffect(() => {
    const searchEngine = SearchEngine.getInstance();
    const results = searchEngine.search(params.keywords);
    setDepSuggests(results.departments);
    setListSuggests(results.lists);
    setCandidatesSuggests(results.candidates);
  }, [params]);

  function generateDepSuggests(): JSX.Element[] {
    return depSuggests.map((suggestion) =>
      <div key={`dep-${suggestion}`} className="p-2">
        <Card>
          <Card.Body>
            <Card.Title>
              <FontAwesomeIcon icon={faUniversity} />
              <br />
              {suggestion.replaceAll('_', ' ')}
            </Card.Title>
            <Button href={`#/dipartimento/${suggestion}`}>
              Vedi risultati
            </Button>
          </Card.Body>
        </Card>
      </div >
    ) as any;
  }

  function generateListSuggests(): JSX.Element[] {
    return listSuggests.map((suggestion) =>
      <div key={`list-${suggestion.name}${suggestion.department}${suggestion.entity}${suggestion.year}`}
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
                    <FontAwesomeIcon icon={faUniversity} />&nbsp;
                    {suggestion.department?.replaceAll('_', ' ')}
                    {suggestion.entity?.replaceAll('_', ' ')}
                  </div>
                </div>
              </div>
            </Card.Text>
            <Button href={suggestion.path}>
              Vedi risultati
            </Button>
          </Card.Body>
        </Card>
      </div>
    ) as any;
  }

  function generateCandidatesSuggests(): JSX.Element[] {
    return candidatesSuggests.map((suggestion) =>
      <div key={`list-${suggestion.name}${suggestion.department}${suggestion.entity}${suggestion.year}`}
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
                    {
                      suggestion.listName &&
                      <ListLogo listName={suggestion.listName} />
                    }
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
                    {suggestion.department?.replaceAll('_', ' ')}
                    {suggestion.entity?.replaceAll('_', ' ')}
                  </div>
                </div>
              </div>
            </Card.Text>
            <Button href={suggestion.path}>
              Vedi risultati
            </Button>
          </Card.Body>
        </Card>
      </div>
    ) as any;
  }

  return (
    <div className="search-results">
      <h2>Ricerca di <i>{params.keywords}</i>:</h2>
      <div className="suggestions">
        {generateDepSuggests()}
        {generateListSuggests()}
        {generateCandidatesSuggests()}
      </div>
    </div>
  );
};
