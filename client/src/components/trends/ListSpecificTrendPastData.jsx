import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
class ListSpecificTrendPastData extends Component {
  state = {
    collectionName: '',
    id: '',
    historicalData: []
  };

  componentDidMount() {
    this.fetchHistory();
  }

  fetchHistory() {
    const { collection, id } = this.props.match.params;
    const url = `/api/collectionhistoricdata?collection=${collection}/&id=${id}`;

    axios.get(url).then(res => {
      const { collectionName, snapShot } = res.data[0];
      if (res.data === []) {
        return;
      }
      axios.get(`/api/collection?search=${collectionName}`).then(res => {
        this.setState({ historicalData: snapShot, id: res.data[0]._id, collectionName });
      });
    });
  }

  handleDeleteTrendItem(date) {
    console.log('delete');
    const { collectionName } = this.state;
    const url = `/api/collectionhistoricdata/removeoneTrend/${this.state.id}`;
    const body = { collectionName, date };
    console.log(body);
    axios.put(url, body).then(res => {
      console.log(res.data.snapShot);
      this.setState({ historicalData: res.data.snapShot });
    });
  }

  renderHistoricList() {
    return (
      <ul>
        {this.state.historicalData.map(snapShot => {
          return (
            <li key={snapShot._id}>
              <Link
                to={`/trends/individualhistorictrend/${this.state.collectionName}/${this.state.id}/${snapShot.date}`}
              >
                Week of{' '}
                {moment(snapShot.date)
                  .subtract(6, 'days')
                  .format('L')}
              </Link>
              <Link
                to={`/trends/individualhistorictrend/edit/${this.state.collectionName}/${this.state
                  .id}/${snapShot.date}`}
                style={{ marginLeft: '2rem' }}
                className="btn btn-warning"
              >
                Edit
              </Link>
              <button
                style={{ marginLeft: '2rem' }}
                className="btn btn-danger"
                onClick={() => this.handleDeleteTrendItem(snapShot.date)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div className="container">
        <h3>{`Historic Data for ${this.state.collectionName}`}</h3>
        {this.renderHistoricList()}
      </div>
    );
  }
}

export default ListSpecificTrendPastData;
