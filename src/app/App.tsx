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
import { years } from '../data/years';
import Department from './department/Department';
import Contacts from './contacts/Contacts';
import { SearchPage } from './search/SearchPage';
import cdls500 from '../data/cdl-500';
import ResultsMed from './results/ResultsMed/ResultsMed';
import ResultsSingle from './results/ResultsSingle/ResultsSingle';
import dottorandi from '../data/dottorandi';
import Footer from './footer/Footer';
import { Table } from 'react-bootstrap';
import NotFound from './not-found/NotFound';
import HigherPolitics from './higher-politics/HigherPolitics';
import Home from './home/Home';
import DepList from './dep-list/DepList';
import CdlList from './cdl-list/CdlList';
import Cdl from './cdl/Cdl';
import { datareader } from '../data/DataReader';
import fixName from './utils/FixName';

const App = (): JSX.Element => {
  const handleOnClick = (route: string): void => { window.location.href = route; };

  function higherPoliticsRoutes(): JSX.Element[] {
    return (
      datareader.getAllHigherPolitics().map((entity: string) => {
        return entity.includes('medicina') ? (<Route exact path='#'></Route>) : (
          <Route exact path={`/${entity}`} key={entity} render={(): JSX.Element => <HigherPolitics title={fixName(entity)} path={entity} />} />
        );
      })
    );
  }

  function medResults(): JSX.Element[] {
    return (
      datareader.getYearsOfSubEntity('organi superiori', 'Coordinamento_medicina').map((year: string): JSX.Element => {
        return (
          <ResultsMed anno={year} key={`medRes${year}`} path="Coordinamento_medicina" />
        );
      })
    );
  }

  return (
    <div className="App">
      <Menu />
      <div className="container-fluid">
        <HashRouter basename="/">
          <Switch>
            <Route exact path="/home" component={Home} />
            {higherPoliticsRoutes()}
            <Route exact path="/Coordinamento_medicina">
              <h2 className="mt-5">Coordinamento Facoltà di Medicina</h2>
              <div className="py-4">
                {medResults()}
              </div>
            </Route>
            <Route exact path="/dipartimenti">
              <DepList />
            </Route>
            <Route exact path="/dipartimento/:dipartimento" component={Department} />
            <Route exact path="/cdl/:cdl" component={Cdl} />
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
                    <Results
                      anno="2016-2018"
                      entity="dottorandi"
                      subEntity={c}
                      path={`dottorandi/${c}`}
                      details={false}
                      key={`${c}2016-2018`}
                      showList={true}
                      showDetailsList />
                  </div>
                ])}
                <hr className="mb-5" />
              </div>
            </Route>
            <Route exact path="/dottorandi/:anno/:cdl" component={ResultsSingle} />
            <Route exact path="/cdl">
              <div className="cdls">
                {
                  years.map((y) => [
                    <hr key={`hr${y}`} />,
                    <CdlList key={`cdl${y}`} year={y} />
                  ])
                }
              </div>
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
