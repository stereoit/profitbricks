import React from 'react';
import {TableRow,TableRowColumn} from 'material-ui/Table';

const TestrunRow = ({testrun}) => {
  return (
    <TableRow>
      <TableRowColumn>{testrun.id}</TableRowColumn>
      <TableRowColumn>{testrun.username}</TableRowColumn>
      <TableRowColumn>{testrun.status}</TableRowColumn>
    </TableRow>
  )
}
export default TestrunRow
