import React, { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import SearchEngine from './SearchEngine';
import './SearchForm.scss';

export const SearchForm = (): JSX.Element => {
  const [formValue, setFormValue] = useState('');
  const [suggestions, setSuggestions] = useState(['']);

  function onInputFormChange (event: any): void {
    setFormValue(event.target.value);
    const value = event.target.value;
    const searchEngine = new SearchEngine(null);
    setSuggestions(searchEngine.search(value));
  }

  function generateSuggestions (): JSX.Element[] {
    const results = [];
    for (const suggestion of suggestions) {
      results.push(
        <a href={`#/dipartimento/${suggestion}`}>
          <ListGroup.Item action variant="light">
            {suggestion.replaceAll('_', ' ')}
          </ListGroup.Item>
        </a>

      );
    }
    return results;
  }

  return (<div className="search col-2 ml-auto">
    <Form.Control type="text"
      className="form-control"
      value={formValue}
      onChange={onInputFormChange}
      placeholder="Cerca dipartimento, candidato, lista..." />
    <ListGroup className={formValue.length > 0 ? 'suggestions-list' : 'd-none' }>
      {generateSuggestions()}
    </ListGroup>
  </div>);
};
