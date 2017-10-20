import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

const CurrentTrendsLink = styled(Link)`
  width: 20rem;
  display: inline-block;
  margin: 4px 0;
  font-size: 1.25rem;
`;

const ButtonContainer = styled.span`
  position: absolute;
  right: -0.5rem;
  bottom: 10px;
`;
const Button = styled.button`margin-right: 10px;`;

class CurrentTrends extends Component {
  state = {
    search: '',
    historicalData: []
  };
  componentDidMount() {
    this.fetchHistoricalData();
  }

  fetchHistoricalData() {
    const url = `/api/collectionhistoricdata/?search=${this.state.search}`;

    axios.get(url).then(res => {
      this.setState({ historicalData: res.data });
    });
  }

  renderCollections() {
    if (this.state.historicalData.length === 0) {
      return;
    }

    return this.state.historicalData.map((collection, i) => {
      //if all data points have been deleted do not show collection untill a new data point has been added
      if (collection.snapShot.length === 0) {
        return '';
      }
      return (
        <CollectionHolder key={collection._id} switchStyle={i}>
          <CurrentTrendsLink to={`/trends/historicalchart/:${collection.collectionName}/${collection._id}`}>
            <h3>{collection.collectionName}</h3>
          </CurrentTrendsLink>
          <CurrentTrendsLink to={`/trends/listhistorictrend/:${collection.collectionName}/${collection._id}`}>
            Trend Data
          </CurrentTrendsLink>
          <ButtonContainer>
            <Button onClick={() => this.deleteConformation(collection._id)} className="btn btn-danger">
              Delete Trend Data
            </Button>
          </ButtonContainer>
        </CollectionHolder>
      );
    });
  }

  deleteConformation(id) {
    if (window.confirm('This will delete all Trend Data for this collection. Are you sure?') === true) {
      this.handleTrendDelete(id);
    } else {
      return;
    }
  }

  handleTrendDelete(id) {
    const url = `/api/collectionhistoricdata/${id}`;
    axios.delete(url).then(() => this.fetchHistoricalData());
  }

  render() {
    return (
      <div className="container">
        <h3>Current Collections With Historical Data:</h3>
        {this.renderCollections()}
      </div>
    );
  }
}

export default CurrentTrends;
