import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SnapShotHolder = styled.div`
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

const SnapShotsLink = styled(Link)`
  display: inline-block;
  margin: 4px 0;
  font-size: 1.25rem;
`;

const ButtonContainer = styled.span`
  position: absolute;
  right: -0.5rem;
  bottom: 10px;
`;

const DeleteButton = styled.button`
  margin-right: 10px;
  display: inline-block;
`;
const EditButton = styled(Link)`
  margin-right: 10px;
  display: inline-block;
`;

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
    const { collectionName } = this.state;
    const url = `/api/collectionhistoricdata/removeoneTrend/${this.state.id}`;
    const body = { collectionName, date };

    axios.put(url, body).then(res => this.setState({ historicalData: res.data.snapShot }));
  }

  renderHistoricList() {
    return (
      <div>
        {this.state.historicalData.map((snapShot, i) => {
          const EditPath = `/trends/individualhistorictrend/edit/${this.state.collectionName}/${this.state
            .id}/${snapShot.date}`;

          return (
            <SnapShotHolder key={snapShot._id} switchStyle={i}>
              <SnapShotsLink
                to={`/trends/individualhistorictrend/${this.state.collectionName}/${this.state.id}/${snapShot.date}`}
              >
                <span>{`Week of
                ${moment(snapShot.date)
                  .subtract(6, 'days')
                  .format('L')}`}</span>
              </SnapShotsLink>
              <ButtonContainer>
                <EditButton to={EditPath} className="btn btn-warning">
                  Edit
                </EditButton>
                <DeleteButton className="btn btn-danger" onClick={() => this.handleDeleteTrendItem(snapShot.date)}>
                  Delete
                </DeleteButton>
              </ButtonContainer>
            </SnapShotHolder>
          );
        })}
      </div>
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
