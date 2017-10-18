import React from 'react';
import equations from '../../helpers/detailedcollectionequtions';

const TableHeader = () => {
  const TABLE_HEADER = equations.TABLE_HEADER();

  return (
    <thead>
      <tr>{TABLE_HEADER.map(header => <th key={header}>{header}</th>)}</tr>
    </thead>
  );
};

export default TableHeader;
