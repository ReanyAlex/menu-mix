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
      if (res.data.length === 0) {
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
        <div key={_id} style={{ padding: '.5rem', margin: '.25rem 0 0 0', background: 'lightgrey' }}>
          <div style={{ marginTop: '.25rem' }}>
            <Link to={`/newcollection/${collectionName}/${_id}`} style={{ display: 'inline-block' }}>
              <h3>Collection Title: {collectionName}</h3>
            </Link>

            <span style={{ float: 'right' }}>
              <Link
                to={`/newcollection/${collectionName}/${_id}/edit`}
                className="btn btn-warning"
                style={{ display: 'inline-block', height: '100%' }}
              >
                Edit
              </Link>
              <button
                style={{ margin: '0 1rem 0 1rem' }}
                className="btn btn-danger"
                onClick={() => this.handleDelete(_id)}
              >
                Delete
              </button>
            </span>
          </div>
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
          <Link to="/newcollection" className="btn btn-primary" style={{ marginTop: '2rem' }}>
            Create New Collection
          </Link>
        </div>
      </div>
    );
  }
}

export default CurrentCollections;
