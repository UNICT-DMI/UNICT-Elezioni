import React, { FunctionComponent } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import './App.scss';
import Navbar from './navbar/Navbar';
import Results from './results/Results';

const App: FunctionComponent = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/results">
            <Results anno="2018-2020" dipartimento="dmi" />
            <Results anno="2016-2018" dipartimento="dmi" />
          </Route>
          <Route path="/page">
            <AnotherPage />
          </Route>
          <Route path="/not-found">
            <NotFound />
          </Route>
          <Redirect to='/not-found' />
        </Switch>
      </Router>
    </div>
  );
}

function Home() {
  return <h2>Hello world!</h2>;
}

function AnotherPage() {
  return <h2>Another Page!</h2>;
}

function NotFound() {
  return <h2>404 - Not Found</h2>;
}

export default App;
