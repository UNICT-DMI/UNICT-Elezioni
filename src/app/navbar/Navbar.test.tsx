import React from 'react';
import { render } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
  test('renders learn react link', () => {
    const { getByText } = render(<Navbar />);
    const linkElement = getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });  
});
