import React from 'react';
import equations from '../../helpers/detailedcollectionequtions';

import styled from 'styled-components';

const TableData = styled.td`
  white-space: nowrap;
  border: solid 1px gray;
  margin: 0 0.5rem;
  font-size: 1em;
  text-align: center;
`;

const AmountInput = styled.input`width: 5rem;`;

const itemAmountInput = (collectionName, name, nestedItem, handleNumberOfItemsSold) => {
  return (
    <AmountInput
      min="0"
      type="number"
      value={nestedItem}
      onChange={e => handleNumberOfItemsSold(e.target.value, name)}
    />
  );
};

const TableRows = ({
  itemsSoldPerItem,
  collectionName,
  items,
  itemsSoldTotal,
  numItemsSoldArray,
  handleNumberOfItemsSold
}) => {
  return items.map((item, i) => {
    const { _id, cost, price } = item;
    const name = itemsSoldPerItem[i].item;
    const nestedItem = itemsSoldPerItem[i].amount;

    const ITEM_EQUATIONS = equations.ITEM_EQUATIONS(
      name,
      itemAmountInput,
      handleNumberOfItemsSold,
      collectionName,
      nestedItem,
      cost,
      price,
      items,
      numItemsSoldArray,
      i,
      itemsSoldTotal,
      itemsSoldPerItem
    );
    return <tr key={_id}>{ITEM_EQUATIONS.map((equation, i) => <TableData key={i}>{equation}</TableData>)}</tr>;
  });
};

export default TableRows;
