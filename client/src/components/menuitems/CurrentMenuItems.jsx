import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import EditItemForm from './EditItemForm';

const ItemHeaders = styled.span`
  text-decoration: underline;
  width: 9rem;
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 1.25rem;
  padding-left: 0.5rem;
`;

const ItemValues = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 9rem;
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 1.25rem;

  &:hover {
    white-space: normal;
  }
`;

const ButtonContainer = styled.span`
  position: absolute;
  right: -0.5rem;
  bottom: 0.25rem;
`;

const Button = styled.button`
  margin-right: 10px;
  display: inline-block;
`;

class CurrentMenuItems extends Component {
  state = {
    editId: '',
    search: '',
    currentItemData: []
  };

  componentDidMount() {
    this.fetchItemData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search === this.state.search) {
      return;
    }
    this.fetchItemData();
  }

  //get items
  fetchItemData() {
    const that = this;
    let url = `/api/item/?search=${this.state.search}`;
    axios(url).then(data => {
      that.setState({ currentItemData: data.data });
    });
  }

  //delete item
  handleDelete(id) {
    const url = `/api/item/${id}`;
    axios.delete(url).then(() => this.fetchItemData());
  }

  updateSearch(search) {
    this.setState({ search });
  }

  finishedEdit() {
    this.setState({ editId: '' });
    this.fetchItemData();
  }

  renderHeader() {
    const HEADER_VALUES = ['Name', 'Category', 'Cost', 'Sell Price', 'Item Cost'];

    return HEADER_VALUES.map(value => <ItemHeaders key={value}>{value}</ItemHeaders>);
  }

  renderRows() {
    const { currentItemData } = this.state;

    if (currentItemData.length === 0) return;

    return currentItemData.map((item, i) => {
      if (item._id === this.state.editId) {
        return <EditItemForm key={item._id} item={item} finishedEdit={this.finishedEdit.bind(this)} />;
      }
      return this.renderItemValues(item, i);
    });
  }

  renderItemValues({ _id, name, category, cost, price }, i) {
    let style;
    const ITEM_VALUES = [
      name,
      category,
      `$${(cost / 100).toFixed(2).toLocaleString('en', 'currency')}`,
      `$${(price / 100).toFixed(2).toLocaleString('en', 'currency')}`,
      `${(cost / price * 100).toFixed(2)}%`
    ];

    if (i % 2) {
      style = { background: 'lightgrey', padding: '.5rem', position: 'relative' };
    } else {
      style = { padding: '.5rem', position: 'relative' };
    }

    return (
      <div key={_id} style={style}>
        {ITEM_VALUES.map((value, i) => {
          return <ItemValues key={i}>{value}</ItemValues>;
        })}
        {this.renderButtons(_id)}
      </div>
    );
  }

  renderButtons(_id) {
    const { from, itemsToCollection, addItemsToCollection, removeItemsFromCollection } = this.props;

    if (from === 'Collection') {
      return (
        <ButtonContainer>
          {itemsToCollection.indexOf(_id) === -1 ? (
            <Button className="btn btn-warning" onClick={e => addItemsToCollection(_id, e)}>
              Add
            </Button>
          ) : (
            <Button className="btn btn-danger" onClick={e => removeItemsFromCollection(_id, e)}>
              Remove
            </Button>
          )}
        </ButtonContainer>
      );
    }

    return (
      <ButtonContainer>
        <Button className="btn btn-warning" onClick={() => this.setState({ editId: _id })}>
          Edit
        </Button>
        <Button className="btn btn-danger" onClick={() => this.handleDelete(_id)}>
          Delete
        </Button>
      </ButtonContainer>
    );
  }

  render() {
    return (
      <div className="container">
        <h4>Current menu items:</h4>
        <input type="text" placeholder="Search" aria-label="Search" onChange={e => this.updateSearch(e.target.value)} />
        <br />
        {this.renderHeader()}
        {this.renderRows()}
      </div>
    );
  }
}

export default CurrentMenuItems;
