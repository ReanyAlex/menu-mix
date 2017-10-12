import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Dashboard from './Dashboard';
import Settings from './Settings';
import MenuItems from './menuitems/MenuItems';
import NewMenuItems from './menuitems/NewMenuItems';

import CurrentCollections from './collections/CurrentCollections';
import NewCollection from './collections/NewCollection';
import DetailedCollection from './collections/DetailedCollection';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/items" component={MenuItems} />
          <Route exact path="/newitems" component={NewMenuItems} />
          <Route exact path="/collections" component={CurrentCollections} />
          <Route exact path="/newcollection" component={NewCollection} />
          <Route exact path="/newcollection/:collection/:id" component={DetailedCollection} />
          <Route exact path="/newcollection/:collection/:id/:edit" component={NewCollection} />
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
