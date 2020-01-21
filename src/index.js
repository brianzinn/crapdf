import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Entity from './Entity'
import Rating from './Rating'
import * as serviceWorker from './serviceWorker';

const Routes = () => (
    <Switch>
      <Route exact={true} path='/' component={App} />
      <Route path='/stars/:rating' component={Rating} />
      <Route path='/entity/:entityId' component={Entity} />
    </Switch>
);

hydrate(
    <BrowserRouter>
        <Routes />
    </BrowserRouter>,
    document.getElementById('root')
  );
  
  if (module.hot) {
    module.hot.accept();
  }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
