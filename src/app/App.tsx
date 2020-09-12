import React, { FunctionComponent } from 'react';
import './App.scss';
import Navbar from './navbar/Navbar';
import Results from './results/Results';

const App: FunctionComponent = () => {
  return (
    <div className="App">
      <Navbar />
      <Results />
    </div>
  );
}

export default App;
