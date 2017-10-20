import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CurrentMenuItems from './CurrentMenuItems';
import styled from 'styled-components';

const NewItemsLink = styled(Link)`margin: 3rem 0;`;

class MenuItems extends Component {
  render() {
    return (
      <div className="container">
        <CurrentMenuItems />
        <NewItemsLink to="/newitems" className="btn btn-primary">
          Add New Items
        </NewItemsLink>
      </div>
    );
  }
}

export default MenuItems;
