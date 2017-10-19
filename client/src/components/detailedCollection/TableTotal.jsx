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

const TableFiller = styled.td`
  background-color: lightgray;
  border: solid 1px gray;
`;

const TableTotal = ({ items, itemsSoldTotal, numItemsSoldArray }) => {
  const TOTAL_EQUATIONS = equations.TOTAL_EQUATIONS(itemsSoldTotal, items, numItemsSoldArray);

  return (
    <tr>
      <TableFiller />
      {TOTAL_EQUATIONS.map((equation, i) => {
        return (
          <TableData key={i}>
            {equation[0]}
            {!isNaN(equation[1]) ? Number(equation[1]).toLocaleString('en', 'currency') : '0.00'}
            {equation[2]}
          </TableData>
        );
      })}
      <TableFiller colSpan={3} />
    </tr>
  );
};

export default TableTotal;
