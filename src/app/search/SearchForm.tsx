import { faGraduationCap, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import ListLogo from '../results/ListLogo/ListLogo';
import { searchEngine } from './SearchEngine';
import './SearchForm.scss';
import { EntityInfo, ListInfo, CandidateInfo } from './search-engine.interface';

interface Props {
  onClose: () => void;
}

export const SearchForm = (props: Props): JSX.Element => {
  const [formValue, setFormValue] = useState('');
  const [entitiesSuggests, setEntitiesSuggests] = useState([] as EntityInfo[]);
  const [listSuggests, setListSuggests] = useState([] as ListInfo[]);
  const [candidatesSuggests, setCandidatesSuggests] = useState(
    [] as CandidateInfo[],
  );

  let inputForm: any;

  useEffect(() => {
    inputForm.focus();
  }, []);

  // add debounce to the input search
  useEffect(() => {
    const handler = setTimeout(() => {
      onInputFormChange(formValue);
    }, 300);

    return (): void => clearTimeout(handler);
  }, [formValue]);

  function onInputFormChange(value: string): void {
    if (!value || value.length < 3) {
      return;
    }

    const results = searchEngine.search(value);

    const { entities, lists, candidates } = results;
    setEntitiesSuggests(entities);
    setListSuggests(lists);
    setCandidatesSuggests(candidates);
  }

  function getEntityURL(suggestion: EntityInfo): string {
    return '#/' + suggestion.path;
  }

  function getPrefix(suggestionPath: EntityInfo['path']): string {
    if (suggestionPath.includes('Dottorandi')) {
      return '[Dottorato]';
    }

    if (suggestionPath.includes('Corso di Laurea')) {
      return '[CdL]';
    }

    if (suggestionPath.includes('Dipartimento')) {
      return '[Dipartimento]';
    }

    return '';
  }

  function generateEntitiesSuggests(): JSX.Element[] {
    return entitiesSuggests.map((suggestion, index) => (
      <a
        className="text-decoration-none"
        key={`entity-${suggestion.name}${suggestion.years}${suggestion.path}${index}`}
        href={getEntityURL(suggestion)}
        onClick={onClickSuggest}
      >
        <ListGroup.Item action variant="light">
          <div className="container">
            <div className="row">
              <div className="col-2">
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  size="4x"
                ></FontAwesomeIcon>
              </div>
              <div className="col-10">
                {getPrefix(suggestion.path)}{' '}
                {suggestion.name.replaceAll('_', ' ')}
              </div>
            </div>
          </div>
        </ListGroup.Item>
      </a>
    )) as any;
  }

  function generateListSuggests(): JSX.Element[] {
    return listSuggests.map((suggestion, index) => (
      <a
        className="text-decoration-none"
        key={`list-${suggestion.name}${suggestion.entity}${suggestion.subEntity}${suggestion.year}${index}`}
        href={`#/${suggestion.path}`}
        onClick={onClickSuggest}
      >
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
                  {getPrefix(suggestion.path)}{' '}
                  {suggestion.subEntity.replaceAll('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </ListGroup.Item>
      </a>
    )) as any;
  }

  function generateCandidatesSuggests(): JSX.Element[] {
    return candidatesSuggests.map((suggestion, index) => (
      <a
        className="text-decoration-none"
        key={`list-${suggestion.name}${suggestion.entity}${suggestion.year}${index}`}
        href={`#/${suggestion.path}`}
        onClick={onClickSuggest}
      >
        <ListGroup.Item action variant="light">
          <div className="container">
            <div className="row">
              <div className="col-2">
                <ListLogo listName={suggestion.listName} />
              </div>
              <div className="col-7 align-items-center d-flex">
                {suggestion.name}
              </div>
              <div className="col-3 align-items-center d-flex">
                <div className="ml-auto">
                  {suggestion.year}
                  <br />
                  {getPrefix(suggestion.path)}{' '}
                  {suggestion.entity?.replaceAll('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </ListGroup.Item>
      </a>
    )) as any;
  }

  function generateSuggestions(): JSX.Element {
    return (
      <div className="suggestions">
        {generateListSuggests()}
        {generateCandidatesSuggests()}
        {generateEntitiesSuggests()}
        <a
          className="view-all text-decoration-none"
          onClick={handleSearchSubmit}
        >
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
            <Form.Control
              type="text"
              className="search-form form-control"
              value={formValue}
              onChange={(e): void => setFormValue(e.target.value)}
              ref={(input: any): void => {
                inputForm = input;
              }}
              placeholder="(BETA) Cerca dipartimento, candidato, lista..."
            />
            <InputGroup.Append>
              <Button type="submit" variant="primary">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
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
