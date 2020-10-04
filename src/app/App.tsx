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
import { SearchForm } from './search/SearchForm';
import Contacts from './contacts/Contacts';
import { SearchPage } from './search/SearchPage';
import cdls from '../data/cdl';

const App: FunctionComponent = () => (
  <div className="App">
    <HashRouter basename="/">
      <Menu />
      <div className="container-fluid pt-4">
        <SearchForm/>
        <Switch>
          <Route exact path="/senato">
            <h2 className="mt-5">Senato</h2>
            <div className="py-4">
              <Results anno="2018-2020" path="Senato" details={false} />
              <Results anno="2016-2018" path="Senato" details={false} />
              <Results anno="2014-2016" path="Senato" details={false} />
            </div>
          </Route>
          <Route exact path="/cda">
            <h2 className="mt-5">Consiglio di Amministrazione (CdA)</h2>
            <div className="py-4">
              <Results anno="2018-2020" path="Consiglio_di_amministrazione" details={false} />
              <Results anno="2016-2018" path="Consiglio_di_amministrazione" details={false} />
              <Results anno="2014-2016" path="Consiglio_di_amministrazione" details={false} />
            </div>
          </Route>
          <Route exact path="/ndv">
            <h2 className="mt-5">Nucleo di Valutazione (NdV)</h2>
            <div className="py-4">
              <Results anno="2018-2020" path="Nucleo_di_valutazione" details={false} />
              <Results anno="2016-2018" path="Nucleo_di_valutazione" details={false} />
              <Results anno="2014-2016" path="Nucleo_di_valutazione" details={false} />
            </div>
          </Route>
          <Route exact path="/csu">
            <h2 className="mt-5">Comitato per lo Sport Universitario (CSU)</h2>
            <div className="py-4">
              <Results anno="2018-2020" path="Comitato_per_lo_sport_universitario" details={false} />
              <Results anno="2016-2018" path="Comitato_per_lo_sport_universitario" details={false} />
              <Results anno="2014-2016" path="Comitato_per_lo_sport_universitario" details={false} />
            </div>
          </Route>
          <Route exact path="/ersu">
            <h2 className="mt-5">Consiglio di Amministrazione ERSU</h2>
            <div className="py-4">
              <Results anno="2019-2023" path="ERSU" details={false} />
            </div>
          </Route>
          <Route exact path="/facolta_medicina">
            <h2 className="mt-5">Consiglio di Amministrazione ERSU</h2>
            <div className="py-4">
              <Results anno="2018-2020" path="Coordinamento_medicina" details={false} />
              <Results anno="2016-2018" path="Coordinamento_medicina" details={false} />
            </div>
          </Route>
          <Route exact path="/dipartimenti">
            <h2 className="mt-5">Dipartimenti</h2>
            {departments.map((d) => [
              <hr className="my-5" key={`hr${d}`} />,
              <h3 key={`h3${d}`}><a href={`#/dipartimento/${d}`}>{d.replace(/_/g, ' ')}</a></h3>,
              years.map((y) => <Results anno={y} path={`dipartimenti/${d}`} details={false} key={`${d}${y}`} showDetailsList />)
            ])}
          </Route>
          <Route exact path="/dipartimento/:dipartimento" component={Department} />
          <Route exact path="/cdl">
            <h2 className="mt-5">Consigli di Corso di Laurea</h2>
            {cdls.map((c) => [
              <hr className="my-5" key={`hr${c}`} />,
              <h3 key={`h3${c}`}><a href={`#/dipartimento/${c}`}>{c.replace(/_/g, ' ')}</a></h3>,
              <Results anno="2018-2020" path={`cdl/${c}`} details={false} key={`${c}2018-2020`} showDetailsList />
            ])}
          </Route>

          <Route exact path="/search/:keywords" component={SearchPage} />
          <Route exact path="/contatti">
            <Contacts/>
          </Route>
          <Route exact path="/not-found">
            <NotFound />
          </Route>
          <Redirect to="/senato" />
        </Switch>
      </div>
    </HashRouter>
  </div>
);

function NotFound(): JSX.Element {
  return <h2>404 - Not Found</h2>;
}

export default App;
