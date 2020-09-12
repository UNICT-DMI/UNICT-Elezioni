import React, { FunctionComponent } from 'react';
import './App.scss';
import Navbar from './navbar/Navbar';
import Container from './container/Container';

const App: FunctionComponent = () => {
  return (
    <div className="App">
      <Navbar />
      <Container />
    </div>
  );
}

export default App;
