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
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import ForwardIcon from 'material-ui/svg-icons/content/forward';


import TestrunRow from './TestrunRow';

const styles = {
  th: {
    width: '50px',
  }
};


const TestrunList = ({loading, testruns, router}) => {
  if (loading) {
    return <div>Loading...</div>
  }
  if (testruns.length == 0) {
    return <div>Please create a Testrun...</div>
  }
  return (
    <Paper className="testruns">
      <Table selectable={true}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={styles.th} >ID</TableHeaderColumn>
            <TableHeaderColumn>Username</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {testruns.map( (testrun, index) => (
								<TableRow key={index}>
						      <TableRowColumn style={styles.th}>{testrun.id}</TableRowColumn>
						      <TableRowColumn>{testrun.username}</TableRowColumn>
						      <TableRowColumn>{testrun.status}</TableRowColumn>
                  <TableRowColumn>
                    <FlatButton
                      label="Details"
                      secondary={true}
                      onClick={() => router.push(`detail/${testrun.id}`)}
                      labelPosition="after"
                    />
                  </TableRowColumn>
						    </TableRow>
							)
					)}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default TestrunList;
