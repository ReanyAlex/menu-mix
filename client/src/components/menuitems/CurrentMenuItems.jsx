import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import EditItemForm from './EditItemForm';

const ItemHeaders = styled.span`
  display: inline-block;
  margin-right: 20px;
  font-size: 1.5rem;
`;

const Button = styled.button`margin-right: 10px;`;

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
        <div>
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
        </div>
      );
    }

    return (
      <div>
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
      </div>
    );
  }

  showItemDiv({ _id, name, cost, price }) {
    return (
      <div key={_id}>
        <p>
          {[
            ['Name: ', name],
            ['Cost: $', cost / 100],
            ['Sell Price: $', price / 100],
            ['Item Cost: ', `${(cost / price * 100).toFixed(2)}%`]
          ].map(header => (
            <ItemHeaders key={header[0]}>
              {header[0]}
              {header[1]}
            </ItemHeaders>
          ))}
        </p>
        {this.renderButtons(_id)}
      </div>
    );
  }

  finishedEdit() {
    this.setState({ editId: '' });
    this.fetchItemData();
  }

  renderItems() {
    const that = this;
    if (this.state.currentItemData.length === 0) {
      return;
    }

    return this.state.currentItemData.map(item => {
      if (item._id === this.state.editId) {
        return <EditItemForm key={item._id} item={item} finishedEdit={this.finishedEdit.bind(this)} />;
      }
      return that.showItemDiv(item);
    });
  }

  render() {
    return (
      <div>
        <h4>Current menu items:</h4>
        {/* <form onSubmit={e => e.preventDefault()}> */}
        <input type="text" placeholder="Search" aria-label="Search" onChange={e => this.updateSearch(e.target.value)} />
        {/* </form> */}
        {this.renderItems()}
      </div>
    );
  }
}

export default CurrentMenuItems;
