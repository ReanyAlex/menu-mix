const equations = {
  contributionMargin(price, cost) {
    return (price - cost) / 100;
  },

  avgPriceOrCost: function(items, category, state) {
    const avgCostArray = [];
    const { numItemsSoldArray, itemsSoldTotal } = state;

    items.map((item, i) => avgCostArray.push(item[category] * numItemsSoldArray[i]));
    const avgCostReduced = avgCostArray.reduce((a, b) => a + b, 0);

    const avgCost = avgCostReduced / itemsSoldTotal / 100;
    return avgCost;
  },

  categorizingHighLow(itemValue, compare) {
    if (itemValue >= compare) {
      return 'High';
    } else if (itemValue < compare) {
      return 'Low';
    }
  },

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
  },

  profitRank(price, cost, items, state) {
    return equations.categorizingHighLow(
      equations.contributionMargin(price, cost),
      equations.avgContributionMargin(items, state)
    );
  },

  popularityRank(numItemsSoldArray, index, itemsSoldTotal) {
    return equations.categorizingHighLow(numItemsSoldArray[index], itemsSoldTotal / numItemsSoldArray.length);
  },

  avgContributionMargin(items, state) {
    return equations.avgPriceOrCost(items, 'price', state) - equations.avgPriceOrCost(items, 'cost', state);
  },

  totalCostPercent(items, state) {
    return equations.avgPriceOrCost(items, 'cost', state) / equations.avgPriceOrCost(items, 'price', state) * 100;
  },

  totalCost(itemsSoldTotal, items, state) {
    return (itemsSoldTotal * equations.avgPriceOrCost(items, 'cost', state)).toFixed(2);
  },

  totalRevenue(itemsSoldTotal, items, state) {
    return (itemsSoldTotal * equations.avgPriceOrCost(items, 'price', state)).toFixed(2);
  },

  totalMargin(itemsSoldTotal, items, state) {
    return (
      itemsSoldTotal *
      (equations.avgPriceOrCost(items, 'price', state) - equations.avgPriceOrCost(items, 'cost', state))
    );
  },

  TABLE_HEADER() {
    return [
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
  },

  ITEM_EQUATIONS(
    name,
    itemAmountInput,
    collectionName,
    nestedItem,
    cost,
    price,
    items,
    state,
    numItemsSoldArray,
    index,
    itemsSoldTotal
  ) {
    return [
      name,
      itemAmountInput(collectionName, name, nestedItem),
      `$${cost / 100}`,
      `$${price / 100}`,
      `${(cost / price * 100).toFixed(2)}%`,
      `$${equations.contributionMargin(price, cost)}`,
      `$${(nestedItem * (cost / 100)).toFixed(2)}`,
      `$${(nestedItem * (price / 100)).toFixed(2)}`,
      `$${(nestedItem * ((price - cost) / 100)).toFixed(2)}`,
      equations.profitRank(price, cost, items, state),
      equations.popularityRank(numItemsSoldArray, index, itemsSoldTotal),
      equations.menuCategory(
        equations.profitRank(price, cost, items, state),
        equations.popularityRank(numItemsSoldArray, index, itemsSoldTotal)
      )
    ];
  },

  TOTAL_EQUATIONS(itemsSoldTotal, items, state) {
    return [
      ['', `${itemsSoldTotal}`, ''],
      ['$', `${equations.avgPriceOrCost(items, 'cost', state).toFixed(2)}`, ''],
      ['$', `${equations.avgPriceOrCost(items, 'price', state).toFixed(2)}`, ''],
      ['', `${equations.totalCostPercent(items, state).toFixed(2)}`, '%'],
      ['$', `${equations.avgContributionMargin(items, state).toFixed(2)}`, ''],
      ['$', `${equations.totalCost(itemsSoldTotal, items, state)}`, ''],
      ['$', `${equations.totalRevenue(itemsSoldTotal, items, state)}`, ''],
      ['$', `${equations.totalMargin(itemsSoldTotal, items, state).toFixed(2)}`, '']
    ];
  }
};

export default equations;
