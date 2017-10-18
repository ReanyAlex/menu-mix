import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import styled from 'styled-components';
import equations from '../../helpers/detailedcollectionequtions';

import Calender from '../collections/Calender';
import DetailedCollectionTable from './DetailedCollectionTable';

const HeaderDiv = styled.div`
  position: relative;
  width: 50%;
  display: inline-block;
`;

const HeaderH3 = styled.h3``;

const HeaderH5 = styled.h5`
  position: absolute;
  top: 6rem;
`;

const Button = styled.button`margin-top: 2rem;`;

class DetailedCollection extends Component {
  state = {
    collectionDate: moment().day(0)._d,
    collectionsData: [],
    itemSoldObject: {},
    numItemsSoldArray: [],
    itemsSoldPerItem: [],
    itemsSoldTotal: 0,
    costPercent: 0,
    totalCost: 0,
    totalRevenue: 0,
    totalMargin: 0,
    trendResMessage: ''
  };

  componentDidMount() {
    this.fetchCollection();
  }

  componentDidUpdate(prevProps, prevState) {
    this.itemsSoldPerItem();
  }

  itemsSoldPerItem() {
    const itemsSoldPerItem = [];
    const { collectionsData, itemSoldObject } = this.state;
    const { items, collectionName } = collectionsData[0];

    items.forEach(item => {
      const nestedItem = itemSoldObject[collectionName][item.name];
      itemsSoldPerItem.push({ item: item.name, amount: nestedItem });
    });

    const nextAmount = this.reduceObject(this.state.itemsSoldPerItem);
    const currentAmount = this.reduceObject(itemsSoldPerItem);
    //check to make sure a change has occured relating to this state item
    if (nextAmount !== currentAmount) {
      this.setState({ itemsSoldPerItem });
    }
  }

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
      const { collectionName } = res.data[0];
      const itemSoldObject = {};
      itemSoldObject[collectionName] = {};

      res.data[0].items.map(item => {
        return (itemSoldObject[collectionName][item.name] = 0);
      });
      this.setState({ collectionsData, itemSoldObject });

      if (date !== undefined) {
        this.fetchHistory();
      }
    });
  }

  fetchHistory() {
    const { collection, date } = this.props.match.params;
    const url = `/api/collectionhistoricdata?search=${collection}`;

    axios.get(url).then(res => {
      if (res.data === []) {
        return;
      }
      res.data[0].snapShot.forEach(snapShot => {
        if (snapShot.date === date) {
          const itemSoldObject = {};
          itemSoldObject[collection] = {};

          snapShot.itemsSoldPerItem.map(item => {
            return (itemSoldObject[collection][item.item] = item.amount);
          });

          this.setState({
            itemsSoldPerItem: snapShot.itemsSoldPerItem,
            itemSoldObject,
            collectionDate: moment(date).subtract(6, 'days')._d
          });
        }
      });
    });
  }

  handleNumberOfItemsSold(collectionName, value, name) {
    const { itemSoldObject } = this.state;
    if (Object.keys(itemSoldObject).length === 0 && itemSoldObject.constructor === Object) {
      itemSoldObject[collectionName] = {};
    }

    itemSoldObject[collectionName][name] = Number(value);
    this.setState({ itemSoldObject });
    this.totalItemsSold(collectionName);
  }

  numItemsSoldArray(collectionName) {
    return Object.values(this.state.itemSoldObject[collectionName]);
  }

  itemsSoldTotal(numItemsSoldArray) {
    return numItemsSoldArray.reduce((a, b) => a + b, 0);
  }

  totalItemsSold(collectionName) {
    const numItemsSoldArray = this.numItemsSoldArray(collectionName);
    const itemsSoldTotal = this.itemsSoldTotal(numItemsSoldArray);
    this.setState({ itemsSoldTotal, numItemsSoldArray });
  }

  renderCollection() {
    const { collectionsData } = this.state;
    //wait till the data is placed into state to renderCollections
    if (collectionsData.length === 0) return;

    const { itemSoldObject, itemsSoldTotal, numItemsSoldArray } = this.state;
    const { _id, collectionName, category, items } = collectionsData[0];

    return (
      <div key={_id}>
        <HeaderDiv>
          <HeaderH3>Collection Title: {collectionName}</HeaderH3>
          <HeaderH5>Category: {category}</HeaderH5>
        </HeaderDiv>

        <HeaderDiv>{this.renderDateSelector()}</HeaderDiv>

        <DetailedCollectionTable
          _id={_id}
          collectionName={collectionName}
          items={items}
          itemSoldObject={itemSoldObject}
          itemsSoldTotal={itemsSoldTotal}
          numItemsSoldArray={numItemsSoldArray}
          handleNumberOfItemsSold={this.handleNumberOfItemsSold.bind(this)}
        />
        <h3 style={{ color: 'blue' }}>{this.state.trendResMessage}</h3>
        {this.renderButtons(items, collectionName)}
      </div>
    );
  }

  renderDateSelector() {
    if (this.props.match.params.edit !== undefined) {
      console.log(this.state.collectionsData);
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
    snapShot.totalCost = equations.totalCost(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal);
    snapShot.totalRevenue = equations.totalRevenue(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal).toFixed(2);
    snapShot.totalMargin = equations.totalMargin(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal).toFixed(2);
    snapShot.itemsSoldPerItem = this.state.itemsSoldPerItem;
    return snapShot;
  }

  handleSnapShotSubmit(items, collectionName) {
    const url = '/api/collectionhistoricdata';
    const snapShot = this.createSnapShotObject(items);

    const header = { collectionName, snapShot };
    axios.post(url, header).then(res => {
      this.setState({ trendResMessage: res.data.message });
    });
  }

  handleEditTrendItem(items, collectionName, date) {
    console.log('edit');
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
    return <div className="container">{this.renderCollection()}</div>;
  }
}

export default DetailedCollection;
