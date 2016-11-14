import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';

const style = {
  'padding': '1em'
}

const TestrunDetail = ({params, testrunStore}) => {
  let testrun = testrunStore.getTestrun(params.testrunID)
    , testFiles = testrun.testfiles.map(data => {
       return {
         name: data.url.split('/')[1],          // not checking properly
         url: '/_uploads/testfiles/' + data.url  // hardcoded constant I know
         }
       }
     )
  return (
    <Paper className="testrun" style={style}>
      <span className="label">Username: </span>
      <span className="value">{testrun.username}</span><br/>
      <span className="label">Status: </span>
      <span className="value">{testrun.status}</span><br/>
      {testrun.testfiles.length ?
        <div>
          Test files
          <ul>
            {testFiles.map((testFile, idx) =>
              <li key={idx}>
                <a href={testFile.url}>{testFile.name}</a>
              </li>
            )}
          </ul>
        </div>
        : null
      }
    </Paper>
  )
}

export default TestrunDetail
