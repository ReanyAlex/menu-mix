import React from 'react';
// import styled from 'styled-components';

import TableHeader from './TableHeader';
import TableRows from './TableRows';
import TableTotal from './TableTotal';

const renderTable = (
  _id,
  collectionName,
  items,
  itemsSoldTotal,
  numItemsSoldArray,
  handleNumberOfItemsSold,
  itemsSoldPerItem
) => {
  // console.log(itemsSoldPerItem);

  return (
    <table key={_id}>
      <TableHeader />
      <tbody>
        <TableRows
          collectionName={collectionName}
          items={items}
          itemsSoldTotal={itemsSoldTotal}
          itemsSoldPerItem={itemsSoldPerItem}
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
  itemsSoldTotal,
  numItemsSoldArray,
  handleNumberOfItemsSold,
  itemsSoldPerItem
}) => {
  return renderTable(
    _id,
    collectionName,
    items,
    itemsSoldTotal,
    numItemsSoldArray,
    handleNumberOfItemsSold,
    itemsSoldPerItem
  );
};

export default DetailedCollectionTable;
