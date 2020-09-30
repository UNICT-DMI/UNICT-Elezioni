import React, { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import SearchEngine from './SearchEngine';
import './SearchForm.scss';

export const SearchForm = (): JSX.Element => {
  const [formValue, setFormValue] = useState('');
  const [suggestions, setSuggestions] = useState(['']);

  function onInputFormChange(event: any): void {
    setFormValue(event.target.value);
    const value = event.target.value;
    const searchEngine = new SearchEngine(null);
    setSuggestions(searchEngine.search(value));
  }

  function generateSuggestions(): JSX.Element[] {
    return suggestions.map((s) =>
      <a key={`#/dipartimento/${s}`} href={`#/dipartimento/${s}`}>
        <ListGroup.Item action variant="light">
          {s.replaceAll('_', ' ')}
        </ListGroup.Item>
      </a>
    ) as any;
  }

  return (<div className="search col-2 ml-auto">
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
