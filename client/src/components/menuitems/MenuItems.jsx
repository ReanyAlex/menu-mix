import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import NewMenuItems from './NewMenuItems';
import CurrentMenuItems from './CurrentMenuItems';

class MenuItems extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <CurrentMenuItems />
          <Link to="/newitems" className="btn btn-primary">
            Add New Items
          </Link>
        </div>
      </div>
    );
  }
}

export default MenuItems;
