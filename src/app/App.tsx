import React, { FunctionComponent } from 'react';
import {
  Switch,
  Route,
  HashRouter,
  Redirect,
} from 'react-router-dom';
import './App.scss';
import Menu from './navbar/Navbar';
import Results from './results/Results';
import departments from '../data/departments';
import { years } from '../data/years';
import Department from './department/Department';
import Contacts from './contacts/Contacts';

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
            <h2 className="mt-5">Consiglio di Amministrazione (CdA)</h2>
            <br />
            <Results anno="2018-2020" path="Consiglio_di_amministrazione" details={false} />
            <Results anno="2016-2018" path="Consiglio_di_amministrazione" details={false} />
            <Results anno="2014-2016" path="Consiglio_di_amministrazione" details={false} />
          </Route>
          <Route exact path="/ndv">
            <h2 className="mt-5">Nucleo di Valutazione (NdV)</h2>
            <br />
            <Results anno="2018-2020" path="Nucleo_di_valutazione" details={false} />
            <Results anno="2016-2018" path="Nucleo_di_valutazione" details={false} />
            <Results anno="2014-2016" path="Nucleo_di_valutazione" details={false} />
          </Route>
          <Route exact path="/csu">
            <h2 className="mt-5">Comitato per lo Sport Universitario (CSU)</h2>
            <br />
            <Results anno="2018-2020" path="Comitato_per_lo_sport_universitario" details={false} />
            <Results anno="2016-2018" path="Comitato_per_lo_sport_universitario" details={false} />
            <Results anno="2014-2016" path="Comitato_per_lo_sport_universitario" details={false} />
          </Route>
          <Route exact path="/contatti">
            <Contacts></Contacts>
          </Route>
          <Route exact path="/dipartimenti">
            <h2 className="mt-5">Dipartimenti</h2>
            <br />
            {departments.map((d) => [
              <hr className="my-5" />,
              <h3><a href={`#/dipartimento/${d}`}>{d.replace(/_/g, ' ')}</a></h3>,
              years.map((y) => <Results anno={y} path={`dipartimenti/${d}`} details={false} showDetailsList />),
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

function NotFound() {
  return <h2>404 - Not Found</h2>;
}

export default App;
