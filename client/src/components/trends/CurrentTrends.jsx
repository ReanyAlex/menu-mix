import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
      console.log(res.data[0].snapShot);
      this.setState({ historicalData: res.data });
    });
  }

  renderCollections() {
    if (this.state.historicalData.length === 0) {
      return;
    }

    return this.state.historicalData.map(collection => {
      return (
        <div key={collection._id}>
          <Link to={`/trends/historicalchart/:${collection.collectionName}/${collection._id}`}>
            <h3>{collection.collectionName}</h3>
          </Link>
        </div>
      );
    });
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
