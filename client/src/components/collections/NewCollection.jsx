import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import CurrentMenuItems from '../menuitems/CurrentMenuItems';

import styled from 'styled-components';

const Label = styled.label`
  display: block;
  position: relative;
  padding: 10px 0 0 0;
  margin: 0;
`;
const Input = styled.input`font-size: 1.5rem;`;

const CollectionInputContainer = styled.div`
  font-size: 1.5rem;
  text-align: center;
  display: block;
  margin-left: 20px;
`;

const Button = styled.input`
  display: block;
  font-size: 1.5rem;
  margin-left: 20px;
  margin-top: 20px;

  @media only screen and (min-width: 1200px) {
    display: inline-block;
    margin-top: 0;
  }
`;

class NewCollection extends Component {
  state = {
    collectionName: '',
    category: '',
    itemsToCollection: []
  };

  componentDidMount() {
    if (this.props.match.params.edit === 'edit') {
      this.fetchDataOnEdit();
    }
  }

  fetchDataOnEdit() {
    const { id, collection } = this.props.match.params;
    const url = `/api/collection/?collection=${collection}/&id=${id}`;

    axios.get(url).then(res => {
      const { collectionName, category, items } = res.data[0];
      const itemsToCollection = [];
      items.forEach(item => itemsToCollection.push(item._id));

      this.setState({ collectionName, category, itemsToCollection });
    });
  }

  addItemsToCollection(id, e) {
    e.preventDefault();
    const { itemsToCollection } = this.state;
    itemsToCollection.push(id);
    this.setState({ itemsToCollection });
  }

  removeItemsFromCollection(id, e) {
    e.preventDefault();
    const { itemsToCollection } = this.state;
    let index = itemsToCollection.indexOf(id);
    if (index !== -1) {
      itemsToCollection.splice(index, 1);
      this.setState({ itemsToCollection });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { collectionName, category, itemsToCollection } = this.state;
    const { id, edit } = this.props.match.params;
    const collectionHeader = { collectionName, category, items: itemsToCollection };
    let url = '';

    //set url based on editing or creating
    edit === 'edit' ? (url = `/api/collection/${id}`) : (url = `/api/collection/`);
    //make put or post request based on editing or creating
    edit === 'edit'
      ? axios.put(url, collectionHeader).then(() => this.props.history.push('/collections'))
      : axios.post(url, collectionHeader).then(() => this.props.history.push('/collections'));
  }

  renderInputs() {
    const NEWCOLLECTION_INPUTS = [
      { value: 'collectionName', displayed: 'New Collection Name:' },
      { value: 'category', displayed: 'New Collection category:' }
    ];

    return NEWCOLLECTION_INPUTS.map(input => {
      const { value, displayed } = input;

      return (
        <CollectionInputContainer key={value}>
          <Label for={value}>{displayed}</Label>
          <Input
            required
            type="text"
            value={this.state[value]}
            onChange={e => this.setState({ [value]: e.target.value })}
            name={value}
            id={value}
          />
        </CollectionInputContainer>
      );
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Create New Collection</h1>
        <form onSubmit={e => this.handleSubmit(e)}>
          {this.renderInputs()}
          <CurrentMenuItems
            from="Collection"
            itemsToCollection={this.state.itemsToCollection}
            addItemsToCollection={this.addItemsToCollection.bind(this)}
            removeItemsFromCollection={this.removeItemsFromCollection.bind(this)}
          />
          <Button type="submit" className="btn btn-primary" />
        </form>
      </div>
    );
  }
}

export default withRouter(NewCollection);
