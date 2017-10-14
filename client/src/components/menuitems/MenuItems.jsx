import React, { Component } from 'react';
// import NewMenuItems from './NewMenuItems';
import CurrentMenuItems from './CurrentMenuItems';

class MenuItems extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <CurrentMenuItems style={{ float: 'left' }} />
        </div>
      </div>
    );
  }
}

export default MenuItems;
