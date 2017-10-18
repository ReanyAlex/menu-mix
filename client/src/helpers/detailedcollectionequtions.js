const equations = {
  contributionMargin(price, cost) {
    return (price - cost) / 100;
  },

  avgPriceOrCost: function(items, category, numItemsSoldArray, itemsSoldTotal) {
    const avgCostArray = [];
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

  profitRank(price, cost, items, numItemsSoldArray, itemsSoldTotal) {
    return equations.categorizingHighLow(
      equations.contributionMargin(price, cost),
      equations.avgContributionMargin(items, numItemsSoldArray, itemsSoldTotal)
    );
  },

  popularityRank(numItemsSoldArray, index, itemsSoldTotal) {
    return equations.categorizingHighLow(numItemsSoldArray[index], itemsSoldTotal / numItemsSoldArray.length);
  },

  avgContributionMargin(items, numItemsSoldArray, itemsSoldTotal) {
    return (
      equations.avgPriceOrCost(items, 'price', numItemsSoldArray, itemsSoldTotal) -
      equations.avgPriceOrCost(items, 'cost', numItemsSoldArray, itemsSoldTotal)
    );
  },

  totalCostPercent(items, numItemsSoldArray, itemsSoldTotal) {
    return (
      equations.avgPriceOrCost(items, 'cost', numItemsSoldArray, itemsSoldTotal) /
      equations.avgPriceOrCost(items, 'price', numItemsSoldArray, itemsSoldTotal) *
      100
    );
  },

  totalCost(itemsSoldTotal, items, numItemsSoldArray) {
    return itemsSoldTotal * equations.avgPriceOrCost(items, 'cost', numItemsSoldArray, itemsSoldTotal);
  },

  totalRevenue(itemsSoldTotal, items, numItemsSoldArray) {
    return itemsSoldTotal * equations.avgPriceOrCost(items, 'price', numItemsSoldArray, itemsSoldTotal);
  },

  totalMargin(itemsSoldTotal, items, numItemsSoldArray) {
    return (
      itemsSoldTotal *
      (equations.avgPriceOrCost(items, 'price', numItemsSoldArray, itemsSoldTotal) -
        equations.avgPriceOrCost(items, 'cost', numItemsSoldArray, itemsSoldTotal))
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
    handleNumberOfItemsSold,
    collectionName,
    nestedItem,
    cost,
    price,
    items,
    numItemsSoldArray,
    index,
    itemsSoldTotal
  ) {
    return [
      name,
      itemAmountInput(collectionName, name, nestedItem, handleNumberOfItemsSold),
      `$${cost / 100}`,
      `$${price / 100}`,
      `${(cost / price * 100).toFixed(2)}%`,
      `$${equations.contributionMargin(price, cost)}`,
      `$${(nestedItem * (cost / 100)).toFixed(2)}`,
      `$${(nestedItem * (price / 100)).toFixed(2)}`,
      `$${(nestedItem * ((price - cost) / 100)).toFixed(2)}`,
      equations.profitRank(price, cost, items, numItemsSoldArray, itemsSoldTotal),
      equations.popularityRank(numItemsSoldArray, index, itemsSoldTotal),
      equations.menuCategory(
        equations.profitRank(price, cost, items, numItemsSoldArray, itemsSoldTotal),
        equations.popularityRank(numItemsSoldArray, index, itemsSoldTotal)
      )
    ];
  },

  TOTAL_EQUATIONS(itemsSoldTotal, items, numItemsSoldArray) {
    return [
      ['', `${itemsSoldTotal}`, ''],
      ['$', `${equations.avgPriceOrCost(items, 'cost', numItemsSoldArray, itemsSoldTotal).toFixed(2)}`, ''],
      ['$', `${equations.avgPriceOrCost(items, 'price', numItemsSoldArray, itemsSoldTotal).toFixed(2)}`, ''],
      ['', `${equations.totalCostPercent(items, numItemsSoldArray, itemsSoldTotal).toFixed(2)}`, '%'],
      ['$', `${equations.avgContributionMargin(items, numItemsSoldArray, itemsSoldTotal).toFixed(2)}`, ''],
      ['$', `${equations.totalCost(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal).toFixed(2)}`, ''],
      ['$', `${equations.totalRevenue(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal).toFixed(2)}`, ''],
      ['$', `${equations.totalMargin(itemsSoldTotal, items, numItemsSoldArray, itemsSoldTotal).toFixed(2)}`, '']
    ];
  }
};

export default equations;
