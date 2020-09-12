import React from 'react';
import { render } from '@testing-library/react';
import Container from './Container';

describe('App', () => {
  test('renders learn react link', () => {
    const { getByText } = render(<Container />);
    const linkElement = getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });  
});
