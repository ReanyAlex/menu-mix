import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import styled from 'styled-components';

class CurrentCollections extends Component {
  state = {
    collectionsData: [],
    itemSoldObject: {}
  };

  componentDidMount() {
    this.fetchCollectionData();
  }

  fetchCollectionData() {
    const url = '/api/collection';

    axios.get(url).then(res => {
      if (res.data === []) {
        return;
      }

      const collectionsData = res.data;
      const { collectionName } = res.data[0];
      const itemSoldObject = {};
      itemSoldObject[collectionName] = {};

      res.data[0].items.map(item => {
        return (itemSoldObject[collectionName][item.name] = 0);
      });

      this.setState({ collectionsData, itemSoldObject });
    });
  }

  handleDelete(id) {
    const url = `/api/collection/${id}`;
    axios.delete(url).then(() => this.fetchCollectionData());
  }

  renderCollections() {
    return this.state.collectionsData.map(collection => {
      const { _id, collectionName, category } = collection;

      return (
        <div key={_id}>
          <Link to={`/newcollection/${collectionName}/${_id}`}>
            <h3>Collection Title: {collectionName}</h3>
          </Link>
          <Link to={`/newcollection/${collectionName}/${_id}/edit`} className="btn btn-warning">
            Edit
          </Link>
          <button style={{ marginLeft: '2rem' }} className="btn btn-danger" onClick={() => this.handleDelete(_id)}>
            Delete
          </button>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <h3>Current Collections:</h3>
          {this.renderCollections()}
          <Link to="/newcollection" className="btn btn-primary">
            Create New Collection
          </Link>
        </div>
      </div>
    );
  }
}

export default CurrentCollections;
