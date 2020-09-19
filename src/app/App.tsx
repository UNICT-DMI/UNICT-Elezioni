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
          <Route path="/senato">
            <Results anno="2018-2020" path="Senato" />
            <Results anno="2016-2018" path="Senato" />
          </Route>
          <Route path="/cda">
            <Results anno="2018-2020" path="Consiglio_di_amministrazione" />
            {/* <Results anno="2016-2018" path="Consiglio_di_amministrazione" /> */}
          </Route>
          <Route path="/dipartimenti">
            <Results anno="2018-2020" path="dipartimenti/Matematica_e_informatica" />
            <Results anno="2016-2018" path="dipartimenti/Matematica_e_informatica" />
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

function NotFound() {
  return <h2>404 - Not Found</h2>;
}

export default App;
