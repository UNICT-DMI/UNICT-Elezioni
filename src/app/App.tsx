import React from 'react';
import {
  Switch,
  Route,
  HashRouter,
  Redirect
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
import cdls500 from '../data/cdl-500';
import ResultsMed from './results/ResultsMed/ResultsMed';
import ResultsSingle from './results/ResultsSingle/ResultsSingle';
import dottorandi from '../data/dottorandi';
import Footer from './footer/Footer';
import { Table } from 'react-bootstrap';
import NotFound from './not-found/NotFound';
import HigherPolitics from './higher-politics/HigherPolitics';
import Home from './home/Home';

const App = (): JSX.Element => {
  const handleOnClick = (route: string): void => { window.location.href = route; };

  return (
    <div className="App">
      <Menu />
      <div className="container-fluid pt-4">
        <HashRouter basename="/">
          <SearchForm />
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/senato" render={(): JSX.Element => <HigherPolitics title={'Senato'} path={'Senato'} />} />
            <Route exact path="/cda" render={(): JSX.Element => <HigherPolitics title={'Consiglio di Amministrazione (CdA)'} path={'Consiglio_di_amministrazione'} />} />
            <Route exact path="/ndv" render={(): JSX.Element => <HigherPolitics title={'Nucleo di Valutazione (NdV)'} path={'Nucleo_di_valutazione'} />} />
            <Route exact path="/csu" render={(): JSX.Element => <HigherPolitics title={'Comitato per lo Sport Universitario (CSU)'} path={'Comitato_per_lo_sport_universitario'} />} />
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
                <ResultsMed anno="2014-2016" path="Coordinamento_medicina" />
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
                <h2 className="mt-5">Consiglio di Dipartimento (Dottorandi) 2018-2020</h2>
                <Table hover bordered responsive className="mb-5">
                  <tbody>
                    {(dottorandi as any)['2018-2020'].map((c: string) => [
                      <tr className="pointer" key={`tr-${c}`} onClick={(): void => handleOnClick(`#/single-results/dottorandi/2018-2020/${c}`)}>
                        <td key={`h3${c}`} className="capitalize">
                          {c.replaceAll('_', ' ')}
                        </td>
                      </tr>
                    ])}
                  </tbody>
                </Table>

                <h2 className="mt-5">Consiglio di Dipartimento (Dottorandi) 2016-2018</h2>
                <hr />
                {(dottorandi as any)['2016-2018'].map((c: string) => [
                  <h3 key={`h3${c}`}>{c.replace(/_/g, ' ')}</h3>,
                  <div className="text-center" key={`dottorandi/${c}`}>
                    <Results anno="2016-2018" path={`dottorandi/${c}`} details={false} key={`${c}2016-2018`} showList={true} showDetailsList />
                  </div>
                ])}
                <hr className="mb-5" />
              </div>
            </Route>
            <Route exact path="/dottorandi/:anno/:cdl" component={ResultsSingle} />
            <Route exact path="/cdl">
              {years.map((y) => [
                <hr key={`hr${y}`} />,
                <h2 className="mt-5" key={`h2${y}`}>Consiglio di Corso di Laurea {y}</h2>,
                (cdls as any)[y].map((c: string) => [
                  <hr className="my-5" key={`hr${c}`} />,
                  <h3 key={`h3${c}`}>{c.replace(/_/g, ' ')}</h3>,
                  <Results anno={y} path={`cdl/${c}`} details={false} key={`${c}${y}`} showDetailsList />
                ])
              ])}
            </Route>
            <Route exact path="/cdl-500">
              <div className="container text-left">
                {years.map((y) => [
                  <h2 className="mt-5" key={`h2${y}`}>Consiglio di Corso di Laurea (&lt;500) {y}</h2>,

                  <Table hover bordered responsive className="mb-5" key={`table${y}`}>
                    <tbody>
                      {(cdls500 as any)[y].map((c: string) => [
                        <tr className="pointer" key={`tr${y}${c}`} onClick={(): void => handleOnClick(`#/single-results/cdl-500/${y}/${c}`)}>
                          <td key={`h3${c}`} className="capitalize">
                            {c.replaceAll('_', ' ')}
                          </td>
                        </tr>
                      ])}
                    </tbody>
                  </Table>
                ])}
              </div>
            </Route>
            <Route exact path="/single-results/:type/:anno/:cdl" component={ResultsSingle} />
            <Route exact path="/search/:keywords" component={SearchPage} />
            <Route exact path="/contatti" component={Contacts} />
            <Route exact path="/not-found" component={NotFound} />
            <Redirect to="/home" />
          </Switch>
        </HashRouter>
      </div>
      <Footer />
    </div>);
};

export default App;
