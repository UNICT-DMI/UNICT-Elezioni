import React from 'react';
import {
  Switch,
  Route,
  HashRouter,
  Redirect
} from 'react-router-dom';
import './App.scss';
import Menu from './navbar/Navbar';
import Department from './department/Department';
import Contacts from './contacts/Contacts';
import { SearchPage } from './search/SearchPage';
import ResultsMed from './results/ResultsMed/ResultsMed';
import ResultsSingle from './results/ResultsSingle/ResultsSingle';
import Footer from './footer/Footer';
import NotFound from './not-found/NotFound';
import Home from './home/Home';
import { datareader } from '../data/DataReader';
import SubEntityList from './sub-entity-list/SubEntityList';
import SubEntity from './sub-entity/SubEntity';

const App = (): JSX.Element => {
  function higherPoliticsRoutes(): JSX.Element[] {
    return (
      datareader.getAllHigherPolitics().map((entity: string) => {
        return (
          <Route exact path={`/${entity}`} key={entity} render={(): JSX.Element => <SubEntity entity={'organi superiori'} subEntity={entity} />} />
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

  function subEntityRoutes(): JSX.Element[] {
    return (
      datareader.getEntities().map((entity: string) => {
        return (
          <Route key={`route-${entity}`} exact path={`/${entity}`}>
            <SubEntityList entity={entity} />
          </Route>
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
            <Route exact path="/organi superiori/Coordinamento_medicina">
              <h2 className="mt-5">Coordinamento Facoltà di Medicina</h2>
              <div className="py-4">
                {medResults()}
              </div>
            </Route>
            {subEntityRoutes()}
            <Route exact path="/dipartimenti/:dipartimento" component={Department} />
            <Route exact path="/dottorandi/:anno/:cdl" component={ResultsSingle} />
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
