import { faGraduationCap, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import ListLogo from '../results/ListLogo/ListLogo';
import { CandidateInfo, EntityInfo, ListInfo, SearchResult, searchEngine } from './SearchEngine';
import './SearchForm.scss';

interface Props {
  onClose: () => void;
}

export const SearchForm = (props: Props): JSX.Element => {
  const [formValue, setFormValue] = useState('');
  const [entitiesSuggests, setEntitiesSuggests] = useState([] as EntityInfo[]);
  const [listSuggests, setListSuggests] = useState([] as ListInfo[]);
  const [candidatesSuggests, setCandidatesSuggests] = useState([] as CandidateInfo[]);

  function onInputFormChange(event: any): void {
    const value = event.target.value;
    const results: SearchResult = searchEngine.search(value);
    setEntitiesSuggests(results.entities.slice(0, 3));
    setListSuggests(results.lists.slice(0, 3));
    setCandidatesSuggests(results.candidates.slice(0, 3));
    setFormValue(value);
  }

  function getEntityURL(suggestion: EntityInfo): string {
    return '#/' + suggestion.path;
  }

  function generateEntitiesSuggests(): JSX.Element[] {
    return entitiesSuggests.map((suggestion) =>
      <a className="text-decoration-none"
        key={`entity-${suggestion.name}${suggestion.years}${suggestion.path}`}
        href={getEntityURL(suggestion)}
        onClick={onClickSuggest}>
        <ListGroup.Item action variant="light">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="logo-search">
                  <FontAwesomeIcon icon={faGraduationCap} size="4x"></FontAwesomeIcon>
                </td>
                <td className="col">{suggestion.name.replaceAll('_', ' ')}</td>
              </tr>
            </tbody>
          </table>
        </ListGroup.Item>
      </a>
    ) as any;
  }

  function generateListSuggests(): JSX.Element[] {
    return listSuggests.map((suggestion) =>
      <a className="text-decoration-none"
        key={`list-${suggestion.name}${suggestion.entity}${suggestion.subEntity}${suggestion.year}`}
        href={`#/${suggestion.path}`}
        onClick={onClickSuggest}>
        <ListGroup.Item action variant="light">
          <div className="container">
            <div className="row">
              <div className="col-2">
                <ListLogo listName={suggestion.name} />
              </div>
              <div className="col-7 align-items-center d-flex">
                {suggestion.name}
              </div>
              <div className="col-3 align-items-center d-flex">
                <div className="ml-auto">
                  {suggestion.year}
                  <br />
                  {suggestion.entity.replaceAll('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </ListGroup.Item>
      </a >
    ) as any;
  }

  function generateCandidatesSuggests(): JSX.Element[] {
    return candidatesSuggests.map((suggestion) =>
      <a className="text-decoration-none"
        key={`list-${suggestion.name}${suggestion.entity}${suggestion.year}`}
        href={`#/${suggestion.path}`}
        onClick={onClickSuggest}>
        <ListGroup.Item action variant="light">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="logo-search" rowSpan={2}>
                  <ListLogo listName={suggestion.listName} />
                </td>
                <td className="align-middle col" rowSpan={2}>
                  {suggestion.name}
                </td>
                <td className="col text-nowrap">
                  {suggestion.year}
                </td>
              </tr>
              <tr>
                <td className="col">
                  {suggestion.entity?.replaceAll('_', ' ')}
                </td>
              </tr>
            </tbody>
          </table>
        </ListGroup.Item>
      </a>
    ) as any;
  }

  function generateSuggestions(): JSX.Element {
    return (
      <div className="suggestions">
        {generateListSuggests()}
        {generateCandidatesSuggests()}
        {generateEntitiesSuggests()}
        <a className="view-all text-decoration-none" onClick={handleSearchSubmit}>
          <ListGroup.Item action variant="primary">
            View All
          </ListGroup.Item>
        </a>
      </div>
    );
  }

  function onClickSuggest(event: any): void {
    event.value = null;
    setFormValue('');
    props.onClose();
  }

  function handleSearchSubmit(event: any): void {
    window.location.href = '#/search/' + formValue;
    setFormValue('');
    props.onClose();
    event.preventDefault();
  }

  return (
    <>
      <div className="search ml-auto">
        <Form onSubmit={handleSearchSubmit}>
          <InputGroup>
            <Form.Control type="text"
              className="search-form form-control"
              value={formValue}
              onChange={onInputFormChange}
              placeholder="(BETA) Cerca dipartimento, candidato, lista..." />
            <InputGroup.Append>
              <Button type="submit" variant="primary"><FontAwesomeIcon icon={faSearch} /></Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        <ListGroup className={formValue.length ? 'suggestions-list' : 'd-none'}>
          {generateSuggestions()}
        </ListGroup>
      </div>
      <div className="page-overlay" onClick={(): void => props.onClose()} />
    </>
  );
};
