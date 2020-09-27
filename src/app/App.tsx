import React, { FunctionComponent } from 'react';
import {
  Switch,
  Route,
  HashRouter,
  Redirect
} from 'react-router-dom';
import './App.scss';
import Menu from './navbar/Navbar';
import Results from './results/Results';
import departments from '../data/departments';
import { years } from '../data/years';
import Department from './department/Department';

const App: FunctionComponent = () => (
  <div className="App">
    <HashRouter basename="/">
      <Menu />
      <br />
      <div className="container-fluid">
        <Switch>
          <Route exact path="/senato">
            <h2 className="mt-5">Senato</h2>
            <br />
            <Results anno="2018-2020" path="Senato" details={false} />
            <Results anno="2016-2018" path="Senato" details={false} />
            <Results anno="2014-2016" path="Senato" details={false} />
          </Route>
          <Route exact path="/cda">
            <h2 className="mt-5">Consiglio di Amministrazione</h2>
            <br />
            <Results anno="2018-2020" path="Consiglio_di_amministrazione" details={false} />
            <Results anno="2016-2018" path="Consiglio_di_amministrazione" details={false} />
          </Route>
          <Route exact path="/dipartimenti">
            <h2 className="mt-5">Dipartimenti</h2>
            <br />
            {departments.map((d) => [
              <hr className="my-5" key={d} />,
              <h3 key={d}><a href={`#/dipartimento/${d}`}>{d.replace(/_/g, ' ')}</a></h3>,
              years.map((y) => <Results anno={y} path={`dipartimenti/${d}`} details={false} key={`${d}${y}`} showDetailsList />)
            ])}
          </Route>
          <Route path="/dipartimento/:dipartimento" component={Department} />
          <Route exact path="/not-found">
            <NotFound />
          </Route>
          <Redirect to="/senato" />
        </Switch>
      </div>
    </HashRouter>
  </div>
);

function NotFound (): JSX.Element {
  return <h2>404 - Not Found</h2>;
}

export default App;
