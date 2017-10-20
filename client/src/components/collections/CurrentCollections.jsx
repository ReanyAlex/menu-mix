import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const CollectionHolder = styled.div`
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

const CollectionTitle = styled.h3`margin: 4px;`;

const FloatRightSpan = styled.span`
  float: right;
  position: absolute;
  right: -15px;
  bottom: 8px;
`;

const DeleteButton = styled.button`margin: 0 1rem 0 1rem;`;

const CollectionLink = styled(Link)`display: inline-block;`;

const NewCollectionLink = styled(Link)`margin-top: 2rem;`;

class CurrentCollections extends Component {
  state = {
    collectionsData: []
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

      this.setState({ collectionsData });
    });
  }

  deleteConformation(id) {
    if (window.confirm('This will delete this collection. Are you sure?') === true) {
      this.handleDelete(id);
    } else {
      return;
    }
  }

  handleDelete(id) {
    const url = `/api/collection/${id}`;
    axios.delete(url).then(() => this.fetchCollectionData());
  }

  renderCollections() {
    return this.state.collectionsData.map((collection, i) => {
      const { _id, collectionName } = collection;
      const ROOT_PATH = `/newcollection/${collectionName}/${_id}`;

      return (
        <CollectionHolder switchStyle={i} key={_id}>
          <CollectionLink to={ROOT_PATH}>
            <CollectionTitle>Collection Title: {collectionName}</CollectionTitle>
          </CollectionLink>

          <FloatRightSpan>
            <Link to={`${ROOT_PATH}/edit`} className="btn btn-warning">
              Edit
            </Link>
            <DeleteButton className="btn btn-danger" onClick={() => this.deleteConformation(_id)}>
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
