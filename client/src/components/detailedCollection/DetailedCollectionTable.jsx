import React from 'react';
import styled from 'styled-components';

import TableHeader from './TableHeader';
import TableRows from './TableRows';
import TableTotal from './TableTotal';

const renderTable = (
  _id,
  collectionName,
  items,
  itemSoldObject,
  itemsSoldTotal,
  numItemsSoldArray,
  handleNumberOfItemsSold
) => {
  return (
    <table key={_id}>
      <TableHeader />
      <tbody>
        <TableRows
          collectionName={collectionName}
          items={items}
          itemSoldObject={itemSoldObject}
          itemsSoldTotal={itemsSoldTotal}
          numItemsSoldArray={numItemsSoldArray}
          handleNumberOfItemsSold={handleNumberOfItemsSold}
        />
        <TableTotal items={items} itemsSoldTotal={itemsSoldTotal} numItemsSoldArray={numItemsSoldArray} />
      </tbody>
    </table>
  );
};

const DetailedCollectionTable = ({
  _id,
  collectionName,
  items,
  itemSoldObject,
  itemsSoldTotal,
  numItemsSoldArray,
  handleNumberOfItemsSold
}) => {
  return renderTable(
    _id,
    collectionName,
    items,
    itemSoldObject,
    itemsSoldTotal,
    numItemsSoldArray,
    handleNumberOfItemsSold
  );
};

export default DetailedCollectionTable;
