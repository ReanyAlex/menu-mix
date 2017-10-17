import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import styled from 'styled-components';
import equations from '../../equtions';

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
    itemsSoldTotal: 0,
    costPercent: 0,
    totalCost: 0,
    totalRevenue: 0,
    totalMargin: 0
  };

  componentDidMount() {
    console.log(document.querySelector('#id'));
    this.fetchCollection();
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

  //Equations for the chart
  // avgPriceOrCost(items, category) {
  //   const avgCostArray = [];
  //   const { numItemsSoldArray, itemsSoldTotal } = this.state;
  //   items.map((item, i) => avgCostArray.push(item[category] * numItemsSoldArray[i]));
  //   const avgCostReduced = avgCostArray.reduce((a, b) => a + b, 0);
  //
  //   const avgCost = avgCostReduced / itemsSoldTotal / 100;
  //   return avgCost;
  // }

  categorizingHighLow(itemValue, compare) {
    if (itemValue >= compare) {
      return 'High';
    } else if (itemValue < compare) {
      return 'Low';
    }
  }

  menuCategory(profit, popularity) {
    if ((profit === 'High') & (popularity === 'High')) {
      return 'Star';
    } else if ((profit === 'High') & (popularity === 'Low')) {
      return 'Puzzle';
    } else if ((profit === 'Low') & (popularity === 'High')) {
      return 'Work Horse';
    } else if ((profit === 'Low') & (popularity === 'Low')) {
      return 'Dog';
    }
  }
  //Equations for the chart above

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
    const m = moment(new Date(this.state.collectionDate));
    const endOfWeekDate = m.add(7, 'days').format('ll');
    console.log(endOfWeekDate);
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
    const TABLE_HEADER = [
      'Item Name',
      '# Sold',
      'Cost',
      'Price',
      'Cost %',
      'CM',
      'Total Cost',
      'Total Revenue',
      'Total Margin',
      `Profit - Rank`,
      'Popularity - Rank',
      'Menu - category'
    ];

    return (
      <thead>
        <tr>{TABLE_HEADER.map(header => <th key={header}>{header}</th>)}</tr>
      </thead>
    );
  }

  renderItemRow({ collectionName, items }) {
    const { itemSoldObject, itemsSoldTotal, numItemsSoldArray } = this.state;
    // const { collectionName, items } = collection;
    const avgCost = equations.avgPriceOrCost(items, 'cost', this.state);
    const avgPrice = equations.avgPriceOrCost(items, 'price', this.state);
    const avgContributionMargin = avgPrice - avgCost;

    return items.map((item, i) => {
      const { _id, name, cost, price } = item;
      const contributionMargin = (price - cost) / 100;
      const nestedItem = itemSoldObject[collectionName][name];
      const profitRank = this.categorizingHighLow(contributionMargin, avgContributionMargin);
      const popularityRank = this.categorizingHighLow(numItemsSoldArray[i], itemsSoldTotal / numItemsSoldArray.length);

      const ITEM_EQUATIONS = [
        name,
        this.itemAmountInput(collectionName, name, nestedItem),
        `$${cost / 100}`,
        `$${price / 100}`,
        `${(cost / price * 100).toFixed(2)}%`,
        `$${contributionMargin}`,
        `$${(nestedItem * (cost / 100)).toFixed(2)}`,
        `$${(nestedItem * (price / 100)).toFixed(2)}`,
        `$${(nestedItem * ((price - cost) / 100)).toFixed(2)}`,
        profitRank,
        popularityRank,
        this.menuCategory(profitRank, popularityRank)
      ];

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
    const avgCost = equations.avgPriceOrCost(items, 'cost', this.state);
    const avgPrice = equations.avgPriceOrCost(items, 'price', this.state);
    const avgContributionMargin = avgPrice - avgCost;

    const TOTAL_EQUATIONS = [
      ['', `${itemsSoldTotal}`, ''],
      ['$', `${avgCost.toFixed(2)}`, ''],
      ['$', `${avgPrice.toFixed(2)}`, ''],
      ['', `${(avgCost / avgPrice * 100).toFixed(2)}`, '%'],
      ['$', `${avgContributionMargin.toFixed(2)}`, ''],
      ['$', `${(itemsSoldTotal * avgCost).toFixed(2)}`, ''],
      ['$', `${(itemsSoldTotal * avgPrice).toFixed(2)}`, ''],
      ['$', `${(itemsSoldTotal * (avgPrice - avgCost)).toFixed(2)}`, '']
    ];

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
    const { collectionDate } = this.state;
    const m = moment(new Date(collectionDate));
    const date = m.add(6, 'days')._d;
    console.log(typeof date, date);

    const { itemsSoldTotal } = this.state;
    const avgCost = equations.avgPriceOrCost(items, 'cost', this.state);
    const avgPrice = equations.avgPriceOrCost(items, 'price', this.state);
    const costPercent = (avgCost / avgPrice * 100).toFixed(2);
    const totalCost = (itemsSoldTotal * avgCost).toFixed(2);
    const totalRevenue = (itemsSoldTotal * avgPrice).toFixed(2);
    const totalMargin = (itemsSoldTotal * (avgPrice - avgCost)).toFixed(2);

    const snapShot = [{ date, costPercent, totalCost, totalRevenue, totalMargin }];
    const header = { collectionName: collectionName, snapShot };
    axios.post(url, header);
  }

  render() {
    console.log(equations.test());
    return <div className="container">{this.renderCollections()}</div>;
  }
}

export default DetailedCollection;
