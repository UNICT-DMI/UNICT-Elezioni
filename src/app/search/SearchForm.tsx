import React, { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import SearchEngine, { ListInfo } from './SearchEngine';
import './SearchForm.scss';

export const SearchForm = (): JSX.Element => {
  const [formValue, setFormValue] = useState('');
  const [depSuggests, setDepSuggests] = useState([] as string[]);
  const [listSuggests, setListSuggests] = useState([] as ListInfo[]);

  function onInputFormChange(event: any): void {
    const value = event.target.value;
    const searchEngine = new SearchEngine();
    const results = searchEngine.search(value);
    setDepSuggests(results.departments);
    setListSuggests(results.lists);
    setFormValue(value);
  }

  function generateDepSuggests(): JSX.Element[] {
    return depSuggests.map((suggestion) =>
      <a key={`dep-${suggestion}`} href={`#/dipartimento/${suggestion}`}>
        <ListGroup.Item action variant="light">
          {suggestion.replaceAll('_', ' ')}
        </ListGroup.Item>
      </a>
    ) as any;
  }

  function generateListSuggests(): JSX.Element[] {
    return listSuggests.map((suggestion) =>
      <a key={`list-${suggestion.name}${suggestion.department}${suggestion.year}`}
        href={`#/dipartimento/${suggestion.department}`}>
        <ListGroup.Item action variant="light">
          {suggestion.name}
          <sub>
            {suggestion.year}
            <sub>
              {suggestion.department.replaceAll('_', ' ')}
            </sub>
          </sub>
        </ListGroup.Item>
      </a>
    ) as any;
  }

  function generateSuggestions(): JSX.Element {
    return (
      <div className="suggestions">
        {generateDepSuggests()}
        {generateListSuggests()}
      </div>
    );
  }

  return (<div className="search col-4 ml-auto">
    <Form.Control type="text"
      className="form-control"
      value={formValue}
      onChange={onInputFormChange}
      placeholder="Cerca dipartimento, candidato, lista..." />
    <ListGroup className={formValue.length > 0 ? 'suggestions-list' : 'd-none'}>
      {generateSuggestions()}
    </ListGroup>
  </div>);
};
