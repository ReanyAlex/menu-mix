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
      this.setState({ historicalData: res.data });
    });
  }

  renderCollections() {
    if (this.state.historicalData.length === 0) {
      return;
    }

    return this.state.historicalData.map(collection => {
      //if all data points have been deleted do not show collection untill a new data point has been added
      if (collection.snapShot.length === 0) {
        return '';
      }
      return (
        <div key={collection._id} style={{ padding: '.5rem', position: 'relative' }}>
          <Link to={`/trends/historicalchart/:${collection.collectionName}/${collection._id}`}>
            <h3>{collection.collectionName}</h3>
          </Link>
          <Link to={`/trends/listhistorictrend/:${collection.collectionName}/${collection._id}`}>Trend Data</Link>
          <button
            onClick={() => this.handleTrendDelete(collection._id)}
            className="btn btn-danger"
            style={{
              position: 'absolute',
              right: '-0.5rem',
              bottom: '1rem'
            }}
          >
            Delete Trend Data
          </button>
        </div>
      );
    });
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
