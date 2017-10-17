const equations = {
  test: function() {
    return 'test';
  },

  avgPriceOrCost: function(items, category, state) {
    const avgCostArray = [];
    const { numItemsSoldArray, itemsSoldTotal } = state;
    items.map((item, i) => avgCostArray.push(item[category] * numItemsSoldArray[i]));
    const avgCostReduced = avgCostArray.reduce((a, b) => a + b, 0);

    const avgCost = avgCostReduced / itemsSoldTotal / 100;
    return avgCost;
  }
};

export default equations;
