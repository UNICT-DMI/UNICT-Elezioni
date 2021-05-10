import React from 'react';
import {
  Switch,
  Route,
  HashRouter,
  Redirect
} from 'react-router-dom';
import './App.scss';
import Menu from './navbar/Navbar';
import Contacts from './contacts/Contacts';
import { SearchPage } from './search/SearchPage';
import ResultsMed from './results/ResultsMed/ResultsMed';
import Footer from './footer/Footer';
import NotFound from './not-found/NotFound';
import Home from './home/Home';
import { datareader } from '../data/DataReader';
import SubEntityList from './sub-entity-list/SubEntityList';
import SubEntity from './sub-entity/SubEntity';
import SubEntitySingle from './sub-entity-single/SubEntitySingle';
import fixName from './utils/FixName';

const App = (): JSX.Element => {
  function higherPoliticsRoutes(): JSX.Element[] {
    return (
      datareader.getAllHigherPolitics().map((entity: string) => {
        return (
          <Route exact path={`/${entity}`} key={entity}>
            <div className="sub-entity">
              <div className="container-fluid">
                <h3 className="mt-5 capitalize">{fixName(entity)}</h3>
                <SubEntity entity={'organi superiori'} subEntity={entity} />
              </div>
            </div>
          </Route>
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

  function subEntitySingleRoutes(): JSX.Element[] {
    return (
      datareader.getEntities().map((entity: string) => {
        return (
          <Route key={`route-single-${entity}`} exact path={'/single/:entity/:subEntity'} component={SubEntitySingle} />
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
            {subEntitySingleRoutes()}
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
