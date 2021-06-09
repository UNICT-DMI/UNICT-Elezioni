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
import Footer from './footer/Footer';
import NotFound from './not-found/NotFound';
import Home from './home/Home';
import { datareader } from '../data/DataReader';
import SubEntityList from './sub-entity-list/SubEntityList';
import SubEntity from './sub-entity/SubEntity';
import SubEntitySingle from './sub-entity-single/SubEntitySingle';
import fixName from './utils/FixName';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-199154600-1');

const App = (): JSX.Element => {
  function higherPoliticsRoutes(): JSX.Element[] {
    return (
      datareader.getAllHigherPolitics().map((entity: string) => {
        return (
          <Route exact path={`/${entity}`} key={entity}>
            <div className="sub-entity">
              <h3 className="mt-5 capitalize">{fixName(entity)}</h3>
              <SubEntity entity={'organi superiori'} subEntity={entity} />
            </div>
          </Route>
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
    </div>
  );
};

export default App;
