import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import styled from 'styled-components';
import equations from '../../helpers/detailedcollectionequtions';

import Calender from './Calender';

const TableData = styled.td`
  white-space: nowrap;
  border: solid 1px gray;
  margin: 0 0.5rem;
  font-size: 1em;
  text-align: center;
`;

const TableFiller = styled.td`
  background-color: lightgray;
  border: solid 1px gray;
`;

const AmountInput = styled.input`width: 5rem;`;

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
    totalMargin: 0
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
    const { collection, id } = this.props.match.params;
    const url = `/api/collection/?collection=${collection}/&id=${id}`;

    axios.get(url).then(res => {
      if (res.data === []) {
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

  handleNumberOfItemsSold(collectionName, value, name) {
    const { itemSoldObject } = this.state;
    if (Object.keys(itemSoldObject).length === 0 && itemSoldObject.constructor === Object) {
      itemSoldObject[collectionName] = {};
    }

    itemSoldObject[collectionName][name] = Number(value);
    this.setState({ itemSoldObject });
    this.totalItemsSold(collectionName);
  }

  totalItemsSold(collectionName) {
    const numItemsSoldArray = Object.values(this.state.itemSoldObject[collectionName]);
    const itemsSoldTotal = numItemsSoldArray.reduce((a, b) => a + b, 0);
    this.setState({ itemsSoldTotal, numItemsSoldArray });
  }

  renderCollections() {
    return this.state.collectionsData.map(collection => {
      const { _id, collectionName, category } = collection;

      return (
        <div key={_id}>
          <HeaderDiv>
            <HeaderH3>Collection Title: {collectionName}</HeaderH3>
            <HeaderH5>Category: {category}</HeaderH5>
          </HeaderDiv>

          <HeaderDiv>{this.renderDateSelector()}</HeaderDiv>
          {this.renderTable(collection)}
          <Button onClick={() => this.handleSnapShotSubmit(collection)} className="btn btn-primary">
            Take SnapShot
          </Button>
        </div>
      );
    });
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

  renderDateSelector() {
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

  renderTable(collection) {
    const { _id } = collection;

    return (
      <table key={_id}>
        {this.renderTableHeader()}
        <tbody>
          {this.renderItemRow(collection)}
          {this.renderTotalRow(collection)}
        </tbody>
      </table>
    );
  }

  renderTableHeader() {
    const TABLE_HEADER = equations.TABLE_HEADER();

    return (
      <thead>
        <tr>{TABLE_HEADER.map(header => <th key={header}>{header}</th>)}</tr>
      </thead>
    );
  }

  renderItemRow({ collectionName, items }) {
    const { itemSoldObject, itemsSoldTotal, numItemsSoldArray } = this.state;

    return items.map((item, i) => {
      const { _id, name, cost, price } = item;
      const { state } = this;
      const nestedItem = itemSoldObject[collectionName][name];

      const ITEM_EQUATIONS = equations.ITEM_EQUATIONS(
        name,
        this.itemAmountInput.bind(this),
        collectionName,
        nestedItem,
        cost,
        price,
        items,
        state,
        numItemsSoldArray,
        i,
        itemsSoldTotal
      );

      return <tr key={_id}>{ITEM_EQUATIONS.map((equation, i) => <TableData key={i}>{equation}</TableData>)}</tr>;
    });
  }

  itemAmountInput(collectionName, name, nestedItem) {
    return (
      <AmountInput
        min="0"
        type="number"
        value={nestedItem}
        onChange={e => this.handleNumberOfItemsSold(collectionName, e.target.value, name)}
      />
    );
  }

  renderTotalRow({ items }) {
    const { itemsSoldTotal } = this.state;

    const TOTAL_EQUATIONS = equations.TOTAL_EQUATIONS(itemsSoldTotal, items, this.state);

    return (
      <tr>
        <TableFiller />
        {TOTAL_EQUATIONS.map((equation, i) => {
          return (
            <TableData key={i}>
              {equation[0]}
              {!isNaN(equation[1]) ? equation[1] : '0.00'}
              {equation[2]}
            </TableData>
          );
        })}
        <TableFiller colSpan={3} />
      </tr>
    );
  }

  handleSnapShotSubmit({ items, collectionName }) {
    const url = '/api/collectionhistoricdata';
    const m = moment(new Date(this.state.collectionDate));
    const { itemsSoldTotal, itemsSoldPerItem } = this.state;
    let snapShot = {};

    snapShot.date = m.add(6, 'days')._d;
    snapShot.costPercent = equations.totalCostPercent(items, this.state);
    snapShot.totalCost = equations.totalCost(itemsSoldTotal, items, this.state);
    snapShot.totalRevenue = equations.totalRevenue(itemsSoldTotal, items, this.state);
    snapShot.totalMargin = equations.totalMargin(itemsSoldTotal, items, this.state);
    snapShot.itemsSoldPerItem = itemsSoldPerItem;
    // console.log(itemsSoldPerItem);
    const header = { collectionName, snapShot };
    axios.post(url, header);
  }

  render() {
    return <div className="container">{this.renderCollections()}</div>;
  }
}

export default DetailedCollection;
