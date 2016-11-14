import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';

import AppContainer from './containers/AppContainer';
import TestrunList from './components/TestrunList';
// import TestrunAdd from './components/TestrunAdd';
import TestrunForm from './components/TestrunForm';
import TestrunDetail from './components/TestrunDetail';
import NoMatch from './components/NoMatch';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


const routes =
  <Route path="/" component={AppContainer}>
    <IndexRoute component={TestrunList} />
    <Route path="addTestrun" component={TestrunForm} />
    <Route path="detail/:testrunID" component={TestrunDetail} />
    <Route path="*" component={NoMatch} />
  </Route>


ReactDOM.render(
  <Router history={browserHistory}  routes={routes} />,
  document.getElementById('app')
);

console.log("Profitbricks test suite runner started");
