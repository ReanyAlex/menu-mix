import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import EditItemForm from './EditItemForm';

const SearchHolder = styled.div`margin-bottom: 1rem;`;

const ItemHeaders = styled.span`
  text-decoration: underline;
  width: ${props => props.width};
  display: inline-block;
  font-size: 1.25rem;
`;

const ItemHolder = styled.div`
  position: relative;
  padding: 0.5rem;
  border-top: ${prompt => {
    return prompt.switchStyle % 2 === 0 ? '1px solid black' : 'none';
  }};
  border-bottom: ${prompt => {
    return prompt.switchStyle % 2 === 0 ? '1px solid black' : 'none';
  }};
  background: ${prompt => {
    return prompt.switchStyle % 2 === 0 ? 'none' : 'lightgrey';
  }};
`;

const ItemValues = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: ${props => props.width};
  display: inline-block;
  margin: 4px 0;
  font-size: 1.25rem;

  &:hover {
    white-space: normal;
  }
`;

const ButtonContainer = styled.span`
  position: absolute;
  right: -0.5rem;
  bottom: 10px;
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
  deleteConformation(id) {
    if (window.confirm('This will delete this item. Are you sure?') === true) {
      this.handleDelete(id);
    } else {
      return;
    }
  }

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
    const HEADER_VALUES = [
      { name: 'Name', width: '20rem' },
      { name: 'Category', width: '15rem' },
      { name: 'Cost', width: '6rem' },
      { name: 'Sell Price', width: '6rem' },
      { name: 'Item Cost', width: '6rem' }
    ];

    return HEADER_VALUES.map(value => (
      <ItemHeaders width={value.width} key={value.name}>
        {value.name}
      </ItemHeaders>
    ));
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
    const ITEM_VALUES = [
      { name: name, width: '20rem' },
      { name: category, width: '15rem' },
      { name: `$${(cost / 100).toFixed(2).toLocaleString('en', 'currency')}`, width: '6rem' },
      { name: `$${(price / 100).toFixed(2).toLocaleString('en', 'currency')}`, width: '6rem' },
      { name: `${(cost / price * 100).toFixed(2)}%`, width: '6rem' }
    ];

    return (
      <ItemHolder key={_id} switchStyle={i}>
        {ITEM_VALUES.map((value, i) => {
          return (
            <ItemValues width={value.width} key={value.name}>
              {value.name}
            </ItemValues>
          );
        })}
        {this.renderButtons(_id)}
      </ItemHolder>
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
        <Button className="btn btn-danger" onClick={() => this.deleteConformation(_id)}>
          Delete
        </Button>
      </ButtonContainer>
    );
  }

  render() {
    return (
      <div className="container">
        <SearchHolder>
          <h4>Current menu items:</h4>
          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            onChange={e => this.updateSearch(e.target.value)}
          />
        </SearchHolder>
        <div>{this.renderHeader()}</div>
        {this.renderRows()}
      </div>
    );
  }
}

export default CurrentMenuItems;
