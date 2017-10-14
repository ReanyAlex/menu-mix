import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import EditItemForm from './EditItemForm';

const ItemHeaders = styled.span`
  text-decoration: underline;
  width: 8rem;
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 1.25rem;
`;

const ItemValues = styled.span`
  width: 8rem;
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 1.25rem;
`;

const Button = styled.button`
  margin-right: 10px;
  display: inline-block;
`;

// const ButtonContainer = styled.button`display: inline-block`;

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

  //edit item

  //delete item
  handleDelete(id) {
    const url = `/api/item/${id}`;
    axios.delete(url).then(() => this.fetchItemData());
  }

  updateSearch(search) {
    this.setState({ search });
  }

  renderButtons(_id) {
    if (this.props.from === 'Collection') {
      return (
        <span>
          {this.props.itemsToCollection.indexOf(_id) === -1 ? (
            <Button
              className="btn btn-warning"
              onClick={e => {
                this.props.addItemsToCollection(_id, e);
              }}
            >
              Add
            </Button>
          ) : (
            <Button
              className="btn btn-danger"
              onClick={e => {
                this.props.removeItemsFromCollection(_id, e);
              }}
            >
              Remove
            </Button>
          )}
        </span>
      );
    }

    return (
      <span style={{ position: 'absolute', right: '-.5rem', bottom: '.25rem' }}>
        <Button
          className="btn btn-warning"
          onClick={() => {
            this.setState({ editId: _id });
          }}
        >
          Edit
        </Button>
        <Button className="btn btn-danger" onClick={() => this.handleDelete(_id)}>
          Delete
        </Button>
      </span>
    );
  }

  showItemDiv({ _id, name, category, cost, price }, i) {
    let style;
    const ITEM_VALUES = [
      name,
      category,
      `$${(cost / 100).toFixed(2)}`,
      `$${(price / 100).toFixed(2)}`,
      `${(cost / price * 100).toFixed(2)}%`
    ];

    if (i % 2) {
      style = { background: 'lightgrey', padding: '.5rem', position: 'relative' };
    } else {
      style = { padding: '.5rem', position: 'relative' };
    }

    return (
      <div key={_id} style={style}>
        {ITEM_VALUES.map(value => <ItemValues key={value}>{value}</ItemValues>)}
        {this.renderButtons(_id)}
      </div>
    );
  }

  finishedEdit() {
    this.setState({ editId: '' });
    this.fetchItemData();
  }

  renderItems() {
    const HEADER_VALUES = ['Name', 'Category', 'Cost', 'Sell Price', 'Item Cost'];
    const that = this;
    if (this.state.currentItemData.length === 0) {
      return;
    }

    return (
      <div>
        {HEADER_VALUES.map(value => (
          <ItemHeaders style={{ paddingLeft: '.5rem' }} key={value}>
            {value}
          </ItemHeaders>
        ))}

        {this.state.currentItemData.map((item, i) => {
          if (item._id === this.state.editId) {
            return <EditItemForm key={item._id} item={item} finishedEdit={this.finishedEdit.bind(this)} />;
          }
          return that.showItemDiv(item, i);
        })}
      </div>
    );
  }

  render() {
    return (
      <div>
        <h4>Current menu items:</h4>
        <input type="text" placeholder="Search" aria-label="Search" onChange={e => this.updateSearch(e.target.value)} />
        {this.renderItems()}
        <div>
          <Link to="/newitems" className="btn btn-primary">
            Add New Items
          </Link>
        </div>
      </div>
    );
  }
}

export default CurrentMenuItems;
