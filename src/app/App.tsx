import React, { FunctionComponent } from 'react';
import {
  Switch,
  Route,
  HashRouter,
  Redirect,
} from 'react-router-dom';
import './App.scss';
import Menu from './navbar/Navbar';
import Results from './results/Results/Results';
import departments from '../data/departments';
import { years } from '../data/years';
import Department from './department/Department';
import { SearchForm } from './search/SearchForm';
import Contacts from './contacts/Contacts';
import { SearchPage } from './search/SearchPage';
import cdls from '../data/cdl';
import cdls_500 from '../data/cdl-500';
import ResultsMed from './results/ResultsMed/ResultsMed';
import ResultsCdL500 from './results/ResultsCdl500/ResultsCdl500';
import dottorandi from '../data/dottorandi';

const App: FunctionComponent = () => {
  const handleOnClick = (route: string) => { window.location.href = route; };

  return (
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
            <h2 className="mt-5">Coordinamento Facoltà di Medicina</h2>
            <div className="py-4">
              <ResultsMed anno="2018-2020" path="Coordinamento_medicina" />
              <ResultsMed anno="2016-2018" path="Coordinamento_medicina" />
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
          <Route exact path="/dipartimenti-dottorandi">
            <div className="container text-left">
              <h2 className="mt-5">Consiglio di Dipartimento (Dottorandi) 2018-2020</h2>,
              <table className="table table-hover table-bordered mb-5">
                <tbody>
                  {(dottorandi as any)['2018-2020'].map((c: string) => [
                  <tr className="pointer" onClick={() => handleOnClick(`#/single-results/dottorandi/2018-2020/${c}`)}>
                    <td key={`h3${c}`} className="capitalize">
                      {c.replaceAll('_', ' ')}
                    </td>
                  </tr>
                  ])}
                </tbody>
              </table>

              <h2 className="mt-5">Consiglio di Dipartimento (Dottorandi) 2016-2018</h2>
              <hr/>
              {(dottorandi as any)['2016-2018'].map((c: string) => [
                <h3 key={`h3${c}`}>{c.replace(/_/g, ' ')}</h3>,
                <div className="text-center">
                  <Results anno="2016-2018" path={`dottorandi/${c}`} details={false} key={`${c}2016-2018`} showList={true} showDetailsList />
                </div>
              ])}
              <hr className="mb-5" />
            </div>
          </Route>
          <Route exact path="/dottorandi/:anno/:cdl" component={ResultsCdL500} />
          <Route exact path="/cdl">
            {years.map((y) => (cdls as any)[y].map((c: string) => [
              <h2 className="mt-5">Consiglio di Corso di Laurea {y}</h2>,
              <hr className="my-5" key={`hr${c}`} />,
              <h3 key={`h3${c}`}><a href={`#/dipartimento/${c}`}>{c.replace(/_/g, ' ')}</a></h3>,
              <Results anno={y} path={`cdl/${c}`} details={false} key={`${c}${y}`} showDetailsList />
            ]))}
          </Route>
          <Route exact path="/cdl-500">
            <div className="container text-left">
              {years.map((y) => [
                <h2 className="mt-5">Consiglio di Corso di Laurea (&lt;500) {y}</h2>,
                
                <table className="table table-hover table-bordered mb-5">
                  <tbody>
                    {(cdls_500 as any)[y].map((c: string) => [
                    <tr className="pointer" onClick={() => handleOnClick(`#/single-results/cdl-500/${y}/${c}`)}>
                      <td key={`h3${c}`} className="capitalize">
                        {c.replaceAll('_', ' ')}
                      </td>
                    </tr>
                    ])}
                  </tbody>
                </table>,
              ])}
            </div>
          </Route>
          <Route exact path="/single-results/:type/:anno/:cdl" component={ResultsCdL500} />
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
  </div>);
}

function NotFound(): JSX.Element {
  return <h2>404 - Not Found</h2>;
}

export default App;
