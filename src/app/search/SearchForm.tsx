import { faGraduationCap, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import ListLogo from '../results/ListLogo/ListLogo';
import SearchEngine, { CandidateInfo, CdlInfo, ListInfo } from './SearchEngine';
import './SearchForm.scss';

interface Props {
  onClose: () => void;
}

export const SearchForm = (props: Props): JSX.Element => {
  const [formValue, setFormValue] = useState('');
  const [depSuggests, setDepSuggests] = useState([] as string[]);
  const [cdlSuggests, setCdlSuggests] = useState([] as CdlInfo[]);
  const [listSuggests, setListSuggests] = useState([] as ListInfo[]);
  const [candidatesSuggests, setCandidatesSuggests] = useState([] as CandidateInfo[]);

  function onInputFormChange(event: any): void {
    const value = event.target.value;
    const searchEngine = SearchEngine.getInstance();
    const results = searchEngine.search(value, 8);
    setDepSuggests(results.departments);
    setCdlSuggests(results.cdls);
    setListSuggests(results.lists);
    setCandidatesSuggests(results.candidates);
    setFormValue(value);
  }

  function generateDepSuggests(): JSX.Element[] {
    return depSuggests.map((suggestion) =>
      <a className="text-decoration-none" key={`dep-${suggestion}`} href={`#/dipartimento/${suggestion}`} onClick={onClickSuggest}>
        <ListGroup.Item action variant="light">
          {suggestion.replaceAll('_', ' ')}
        </ListGroup.Item>
      </a>
    ) as any;
  }

  function getCdlUrl(suggestion: CdlInfo): string {
    if (suggestion.isUnder500) {
      return '#single-results/cdl-500/' + suggestion.year + '/' + suggestion.name;
    }
    return '#/cdl/' + suggestion.name;
  }

  function generateCdlSuggests(): JSX.Element[] {
    return cdlSuggests.map((suggestion) =>
      <a className="text-decoration-none" key={`dep-${suggestion}`} href={getCdlUrl(suggestion)} onClick={onClickSuggest}>
        <ListGroup.Item action variant="light">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="logo-search">
                  <FontAwesomeIcon icon={faGraduationCap} size="4x"></FontAwesomeIcon>
                </td>
                <td className="col">{suggestion.name.replaceAll('_', ' ')}</td>
                <td className="col text-nowrap">{suggestion.year}</td>
              </tr>
            </tbody>
          </table>
        </ListGroup.Item>
      </a>
    ) as any;
  }

  function generateListSuggests(): JSX.Element[] {
    return listSuggests.map((suggestion) =>
      <a className="text-decoration-none" key={`list-${suggestion.name}${suggestion.department}${suggestion.entity}${suggestion.year}`}
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
                <td className="col text-nowrap">
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
      <a className="text-decoration-none" key={`list-${suggestion.name}${suggestion.department}${suggestion.entity}${suggestion.year}`}
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
                <td className="col text-nowrap">
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
        {generateCdlSuggests()}
        <a className="text-decoration-none" onClick={handleSearchSubmit}>
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
