import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import styled from 'styled-components';
import equations from '../../helpers/detailedcollectionequtions';

import Calender from '../collections/Calender';
import DetailedCollectionTable from './DetailedCollectionTable';

const HeaderDiv = styled.div`
  width: 45%;
  padding-left: 5%;
  float: left;
  display: inline-block;
`;

const Button = styled.button`margin-top: 2rem;`;

class DetailedCollection extends Component {
  state = {
    collectionDate: moment().day(0)._d,
    collectionsData: [],
    itemsSoldPerItem: [],
    trendResMessage: ''
  };

  componentDidMount() {
    this.fetchCollection();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // this.itemsSoldPerItem();
  // }

  reduceObject(object) {
    return Object.keys(object).reduce(function(previous, key) {
      return previous + object[key].amount;
    }, 0);
  }

  fetchCollection() {
    const { collection, id, date } = this.props.match.params;
    const url = `/api/collection/?collection=${collection}/&id=${id}`;
    axios.get(url).then(res => {
      if (res.data.length === 0) {
        return;
      }

      const collectionsData = res.data;

      const itemsSoldPerItem = [];

      res.data[0].items.forEach(item => {
        console.log(item.name);
        itemsSoldPerItem.push({ item: item.name, amount: 0 });
      });

      if (date !== undefined) {
        this.fetchHistory(collectionsData);
      } else {
        this.setState({ collectionsData, itemsSoldPerItem });
      }
    });
  }

  fetchHistory(collectionsData) {
    const { collection, date } = this.props.match.params;
    const url = `/api/collectionhistoricdata?search=${collection}`;

    axios.get(url).then(res => {
      if (res.data === []) return;
      let index = NaN;
      res.data[0].snapShot.forEach((snap, i) => {
        if (snap.date === date) {
          index = i;
        }
      });

      const itemsSoldPerItem = res.data[0].snapShot[index].itemsSoldPerItem;
      const collectionDate = moment(date).subtract(6, 'days')._d;

      this.setState({ collectionsData, itemsSoldPerItem, collectionDate });
    });
  }

  handleNumberOfItemsSold(value, name) {
    const { itemsSoldPerItem } = this.state;

    itemsSoldPerItem.forEach((item, i) => {
      console.log('name', item.item);
      if (item.item === name) {
        itemsSoldPerItem.splice(i, 1, { item: item.item, amount: Number(value) });
      }
    });
    console.log(itemsSoldPerItem);
    this.setState({ itemsSoldPerItem });
  }

  numItemsSoldArray() {
    const amountArray = this.state.itemsSoldPerItem.map(item => {
      return item.amount;
    });
    return amountArray;
  }

  itemsSoldTotal(numItemsSoldArray) {
    return numItemsSoldArray.reduce((a, b) => a + b, 0);
  }

  renderCollection() {
    const { collectionsData } = this.state;

    if (collectionsData.length === 0) return;

    const numItemsSoldArray = this.numItemsSoldArray();
    const itemsSoldTotal = this.itemsSoldTotal(numItemsSoldArray);
    //wait till the data is placed into state to renderCollections

    const { itemsSoldPerItem } = this.state;
    const { _id, collectionName, category, items } = collectionsData[0];

    return (
      <div style={{ marginBottom: '3rem' }} key={_id}>
        <HeaderDiv>
          <h3 style={{ paddingTop: '2rem' }}>Collection Title: {collectionName}</h3>
          <h5 style={{ paddingTop: '2rem' }}>Category: {category}</h5>
          <h5 style={{ color: 'blue', paddingTop: '2rem' }}>{this.state.trendResMessage}</h5>
        </HeaderDiv>

        <HeaderDiv>{this.renderDateSelector()}</HeaderDiv>

        <DetailedCollectionTable
          _id={_id}
          collectionName={collectionName}
          items={items}
          itemsSoldTotal={itemsSoldTotal}
          itemsSoldPerItem={itemsSoldPerItem}
          numItemsSoldArray={numItemsSoldArray}
          handleNumberOfItemsSold={this.handleNumberOfItemsSold.bind(this)}
        />
        {this.renderButtons(items, collectionName)}
      </div>
    );
  }

  renderDateSelector() {
    if (this.props.match.params.edit !== undefined) {
      return (
        <div style={{ marginBottom: '5rem' }}>
          <h5>
            {`Edit SnapShot for the week of: ${moment(this.props.match.params.date)
              .subtract(6, 'days')
              .format('L')}`}
          </h5>
        </div>
      );
    }
    return (
      <form>
        <fieldset>
          <label>
            <h5 style={{ paddingRight: '.5rem' }}>Date Selection:</h5>
          </label>
          <Calender value={this.state.collectionDate} onDayClick={this.handleDateSelect.bind(this)} />
        </fieldset>
      </form>
    );
  }

  renderButtons(items, collectionName) {
    if (this.props.match.params.edit === 'edit') {
      return (
        <Button
          className="btn btn-warning"
          onClick={() => this.handleEditTrendItem(items, collectionName, this.props.match.params.date)}
        >
          Edit
        </Button>
      );
    } else if (this.props.match.params.date === undefined) {
      return (
        <Button onClick={() => this.handleSnapShotSubmit(items, collectionName)} className="btn btn-primary">
          Take SnapShot
        </Button>
      );
    } else {
      return '';
    }
  }

  handleDateSelect(day, { selected, disabled }) {
    if (disabled) {
      return;
    }
    if (selected) {
      // Unselect the day if already selected
      this.setState({
        collectionDate: undefined
      });
      return;
    }

    this.setState({ collectionDate: day });
  }

  createSnapShotObject(items) {
    const m = moment(new Date(this.state.collectionDate));
    const numItemsSoldArray = this.numItemsSoldArray(this.state.collectionsData[0].collectionName);
    const itemsSoldTotal = this.itemsSoldTotal(numItemsSoldArray);
    let snapShot = {};

    snapShot.date = m.add(6, 'days')._d;
    snapShot.costPercent = equations.totalCostPercent(items, numItemsSoldArray, itemsSoldTotal).toFixed(2);
    snapShot.totalCost = equations.totalCost(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal).toFixed(2);
    snapShot.totalRevenue = equations.totalRevenue(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal).toFixed(2);
    snapShot.totalMargin = equations.totalMargin(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal).toFixed(2);
    snapShot.itemsSoldPerItem = this.state.itemsSoldPerItem;
    return snapShot;
  }

  handleSnapShotSubmit(items, collectionName) {
    const url = '/api/collectionhistoricdata';
    const snapShot = this.createSnapShotObject(items);
    console.log(snapShot);
    const body = { collectionName, snapShot: snapShot };
    axios.post(url, body).then(res => {
      this.setState({ trendResMessage: res.data.message });
    });
  }

  handleEditTrendItem(items, collectionName, date) {
    const url = `/api/collectionhistoricdata/edit/${this.state.id}`;
    const snapShot = this.createSnapShotObject(items);
    const body = { collectionName, date, snapShot };
    axios
      .put(url, body)
      .then(res => {
        this.setState({ historicalData: res.data.snapShot });
      })
      .then(() => this.fetchCollection());
  }

  render() {
    console.log(this.state);
    return <div className="container">{this.renderCollection()}</div>;
  }
}

export default DetailedCollection;
