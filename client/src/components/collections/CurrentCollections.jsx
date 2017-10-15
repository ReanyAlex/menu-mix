import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const CollectionHolder = styled.div`
  padding: 0.5rem;
  margin: 0.25rem 0 0 0;
  background: lightgrey;
`;

const FloatRightSpan = styled.span`float: right;`;

const DeleteButton = styled.button`margin: 0 1rem 0 1rem;`;

const CollectionLink = styled(Link)`display: inline-block;`;

const NewCollectionLink = styled(Link)`margin-top: 2rem;`;

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
      const { _id, collectionName } = collection;
      const ROOT_PATH = `/newcollection/${collectionName}/${_id}`;

      return (
        <CollectionHolder key={_id}>
          <CollectionLink to={ROOT_PATH}>
            <h3>Collection Title: {collectionName}</h3>
          </CollectionLink>

          <FloatRightSpan>
            <Link to={`${ROOT_PATH}/edit`} className="btn btn-warning">
              Edit
            </Link>
            <DeleteButton className="btn btn-danger" onClick={() => this.handleDelete(_id)}>
              Delete
            </DeleteButton>
          </FloatRightSpan>
        </CollectionHolder>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <h3>Current Collections:</h3>
          {this.renderCollections()}
          <NewCollectionLink to="/newcollection" className="btn btn-primary">
            Create New Collection
          </NewCollectionLink>
        </div>
      </div>
    );
  }
}

export default CurrentCollections;
