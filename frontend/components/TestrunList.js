import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import TestrunRow from './TestrunRow';

const TestrunList = ({loading, testruns}) => {
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <Paper className="testruns">
      <Table selectable={true}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Username</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testruns.map( (testrun, index) => (
								<TableRow key={index}>
						      <TableRowColumn>{testrun.id}</TableRowColumn>
						      <TableRowColumn>{testrun.username}</TableRowColumn>
						      <TableRowColumn>{testrun.status}</TableRowColumn>
						    </TableRow>
							)
					)}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default TestrunList;
