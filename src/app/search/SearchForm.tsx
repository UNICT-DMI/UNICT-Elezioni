import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import ListLogo from '../results/ListLogo/ListLogo';
import SearchEngine, { CandidateInfo, ListInfo } from './SearchEngine';
import './SearchForm.scss';

export const SearchForm = (): JSX.Element => {
  const [formValue, setFormValue] = useState('');
  const [depSuggests, setDepSuggests] = useState([] as string[]);
  const [listSuggests, setListSuggests] = useState([] as ListInfo[]);
  const [candidatesSuggests, setCandidatesSuggests] = useState([] as CandidateInfo[]);

  function onInputFormChange(event: any): void {
    const value = event.target.value;
    const searchEngine = SearchEngine.getInstance();
    const results = searchEngine.search(value, 8);
    setDepSuggests(results.departments);
    setListSuggests(results.lists);
    setCandidatesSuggests(results.candidates);
    setFormValue(value);
  }

  function generateDepSuggests(): JSX.Element[] {
    return depSuggests.map((suggestion) =>
      <a key={`dep-${suggestion}`} href={`#/dipartimento/${suggestion}`} onClick={onClickSuggest}>
        <ListGroup.Item action variant="light">
          {suggestion.replaceAll('_', ' ')}
        </ListGroup.Item>
      </a>
    ) as any;
  }

  function generateListSuggests(): JSX.Element[] {
    return listSuggests.map((suggestion) =>
      <a key={`list-${suggestion.name}${suggestion.department}${suggestion.entity}${suggestion.year}`}
        href={suggestion.path} onClick={onClickSuggest}>
        <ListGroup.Item action variant="light">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="logo-search" rowSpan={2}>
                  <ListLogo listName={suggestion.name} />
                </td>
                <td className="align-middle col" rowSpan={2}>
                  {suggestion.name}
                </td>
                <td className="col">
                  {suggestion.year}
                </td>
              </tr>
              <tr>
                <td className="col">
                  {suggestion.department?.replaceAll('_', ' ')}
                  {suggestion.entity?.replaceAll('_', ' ')}
                </td>
              </tr>
            </tbody>
          </table>
        </ListGroup.Item>
      </a >
    ) as any;
  }

  function generateCandidatesSuggests(): JSX.Element[] {
    return candidatesSuggests.map((suggestion) =>
      <a key={`list-${suggestion.name}${suggestion.department}${suggestion.entity}${suggestion.year}`}
        href={suggestion.path} onClick={onClickSuggest}>
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
                <td className="col">
                  {suggestion.year}
                </td>
              </tr>
              <tr>
                <td className="col">
                  {suggestion.department?.replaceAll('_', ' ')}
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
        {generateDepSuggests()}
        {generateListSuggests()}
        {generateCandidatesSuggests()}
      </div>
    );
  }

  function onClickSuggest(event: any): void {
    event.value = null;
    setFormValue('');
  }

  function handleSearchSubmit(event: any): void {
    window.location.href = '#/search/' + formValue;
    setFormValue('');
    event.preventDefault();
  }

  return (
    <div className="search ml-auto">
      <Form onSubmit={handleSearchSubmit}>
        <InputGroup>
          <Form.Control type="text"
            className="form-control"
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
  );
};
