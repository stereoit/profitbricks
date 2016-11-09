import React, { Component } from 'react';
import { Link } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import TestrunStore from '../remote/testrunStore';

const OVERVIEW_LABEL = "Testruns overview"
const ADDNEW_LABEL = "Add new Testrun"

const styles = {
  title: {
    cursor: 'pointer',
  },
  appbar: {
    marginBottom: "3em",
  }
};

/* AppContainer provides simple wrapper for global state and distribute the
 * Usecases data to children
 */
class AppContainer extends Component {

  constructor(props){
    super(props)

    let remoteURL = "//localhost:5000/api";
    this.store = new TestrunStore(remoteURL)

    this.state = {
      testruns: [],
      title: OVERVIEW_LABEL,
      loading: true,
      snackbarOpen: false,
      snackbarMessage: ""
    }

    // autobinding hacks
    this.updateTestruns = this.updateTestruns.bind(this)
    this.addTestrun = this.addTestrun.bind(this)
    this.addTestrunCancel = this.addTestrunCancel.bind(this)
    this.handleTouchAdd = this.handleTouchAdd.bind(this)
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this)

    // subscribe to store updates
    this.store.subscribe(this.updateTestruns)
  }

  // renders children and add several props to it
  renderChildren() {
    const {children} = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        testruns: this.state.testruns,
        loading: this.state.loading,
        onAddTestrun: this.addTestrun,
        onAddTestrunCancel: this.addTestrunCancel
      });
    })
  }

  // lets load testruns when mounted
  componentDidMount() {
    this.store.fetchTestruns()
  }

  // allows adding of testruns
  addTestrun(testrun) {
    this.store.saveTestrun(testrun)
    this.setState({
      "title": OVERVIEW_LABEL,
      "snackbarOpen": true,
      "snackbarMessage": `Testrun ${testrun.username} added`
    })
    this.props.router.push('/');
  }

  // allows adding of testruns
  addTestrunCancel() {
    this.setState({"title": OVERVIEW_LABEL})
    this.props.router.push('/');
  }


  updateTestruns(testruns) {
    testruns = testruns || []
    // console.log("updateTestruns called with ", testruns);
    this.setState({
      testruns: testruns,
      loading: false
    })
  }

  // handles Adde New Testrun button
  handleTouchAdd() {
    this.setState({"title": ADDNEW_LABEL})
    this.props.router.push('/addTestrun');
  }

  handleCloseSnackbar() {
    this.setState({
      snackbarOpen: false,
    });
  }

  render() {
    const {title, snackbarOpen, snackbarMessage} = this.state
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span style={styles.title}>{title}</span>}
            onRightIconButtonTouchTap={this.handleTouchAdd}
            iconElementRight={<FlatButton label="Add Testrun" />}
            showMenuIconButton={false}
            style={styles.appbar}
          />
          <Snackbar
            open={snackbarOpen}
            message={snackbarMessage}
            autoHideDuration={4000}
            onRequestClose={this.handleCloseSnackbar}
          />
          <div className="page-content">
            {this.renderChildren()}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}


export default AppContainer
