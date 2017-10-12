import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const TableData = styled.td`
  border: solid 1px gray;
  margin: 0 0.5rem;
  font-size: 1em;
  text-align: center;
`;

class DetailedCollection extends Component {
  state = {
    collectionsData: [],
    itemSoldObject: {},
    numItemsSoldArray: [],
    itemsSoldTotal: 0
  };

  componentDidMount() {
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

  avgPriceOrCost(items, category) {
    const avgCostArray = [];
    const { numItemsSoldArray, itemsSoldTotal } = this.state;
    items.map((item, i) => avgCostArray.push(item[category] * numItemsSoldArray[i]));
    const avgCostReduced = avgCostArray.reduce((a, b) => a + b, 0);

    const avgCost = avgCostReduced / itemsSoldTotal / 100;
    return avgCost.toFixed(2);
  }

  categorizingHighLow(itemValue, compare) {
    if (itemValue >= compare) {
      return 'High';
    } else if (itemValue < compare) {
      return 'Low';
    }
  }

  itemAmountInput(collectionName, name, nestedItem) {
    return (
      <input
        style={{ width: '5rem' }}
        min="0"
        type="number"
        value={nestedItem}
        onChange={e => this.handleNumberOfItemsSold(collectionName, e.target.value, name)}
      />
    );
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

  renderCollections() {
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

    return this.state.collectionsData.map(collection => {
      const { itemSoldObject, itemsSoldTotal, numItemsSoldArray } = this.state;
      const { _id, collectionName, category, items } = collection;
      const avgCost = this.avgPriceOrCost(items, 'cost');
      const avgPrice = this.avgPriceOrCost(items, 'price');
      const avgContributionMargin = (avgPrice - avgCost).toFixed(2);

      let TOTAL_EQUATIONS = [
        `${itemsSoldTotal}`,
        `$${avgCost}`,
        `$${avgPrice}`,
        `${(avgCost / avgPrice * 100).toFixed(2)}%`,
        `$${avgContributionMargin}`,
        `$${(itemsSoldTotal * avgCost).toFixed(2)}`,
        `$${(itemsSoldTotal * avgPrice).toFixed(2)}`,
        `$${(itemsSoldTotal * (avgPrice - avgCost)).toFixed(2)}`
      ];

      return (
        <div key={_id}>
          <h3>Collection Title: {collectionName}</h3>
          <h5>Category: {category}</h5>
          <table key={_id}>
            <thead>
              <tr>{TABLE_HEADER.map(header => <th key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const { _id, name, cost, price } = item;
                let contributionMargin = (price - cost) / 100;
                let nestedItem = itemSoldObject[collectionName][name];
                let profitRank = this.categorizingHighLow(contributionMargin, avgContributionMargin);
                let popularityRank = this.categorizingHighLow(
                  numItemsSoldArray[i],
                  itemsSoldTotal / numItemsSoldArray.length
                );

                let ITEM_EQUATIONS = [
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

                return (
                  <tr key={_id}>{ITEM_EQUATIONS.map((equation, i) => <TableData key={i}>{equation}</TableData>)}</tr>
                );
              })}

              <tr>
                <TableData style={{ background: 'lightgrey' }} />
                {TOTAL_EQUATIONS.map((equation, i) => <TableData key={i}>{equation}</TableData>)}
                <TableData colSpan={3} style={{ background: 'lightgrey' }} />
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="container">{this.renderCollections()}</div>
      </div>
    );
  }
}

export default DetailedCollection;
