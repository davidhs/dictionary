import React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch, withRouter } from 'react-router-dom';

import Home from './routes/home/Home';
import NotFound from './routes/system-pages/NotFound';

import './App.scss';

type Props = {
  location: Location;
};

function App(props: Props) {
  return (
    <React.Fragment>
      <Helmet defaultTitle="Dictionary" />

      <div className="App">

        <main className="App__main">
          <Switch location={props.location}>
            <Route path="/" exact component={Home} />
            <Route component={NotFound} />
          </Switch>
        </main>

      </div>
    </React.Fragment>
  );
}

export default withRouter(App);
