import React, { Component } from 'react';
import { Link } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import TestrunStore from '../remote/testrunStore';

const OVERVIEW_LABEL = "Testruns overview"
const ADDNEW_LABEL = "Add new Testrun"
const DETAIl_LABEL = "Testrun detail"

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

    let remoteURL = "/api";
    this.store = new TestrunStore(remoteURL)

    this.state = {
      testruns: [],
      loading: true,
      snackbarOpen: false,
      snackbarMessage: ""
    }

    // autobinding hacks
    this.updateTestruns = this.updateTestruns.bind(this)
    this.addTestrun = this.addTestrun.bind(this)
    this.onAddTestrun = this.onAddTestrun.bind(this)
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
        onAddTestrun: this.onAddTestrun,
        onAddTestrunCancel: this.addTestrunCancel,
        testrunStore: this.store
      });
    })
  }

  // lets load testruns when mounted and then fetch periodically
  componentDidMount() {
    this.store.fetchTestruns()
    let intervalID = setInterval(this.store.fetchTestruns, 4000)
    this.setState({'intervalID': intervalID})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalID)
  }

  // allows adding of testruns
  // NOT used this version due to AJAX FileUploads
  addTestrun(testrun) {
    this.store.saveTestrun(testrun)
    this.setState({
      "snackbarOpen": true,
      "snackbarMessage": `Testrun ${testrun.username} added`
    })
    this.props.router.push('/');
  }

  // simple function called after the form with data has been uploaded
  onAddTestrun() {
    this.store.fetchTestruns()
    this.setState({
      "snackbarOpen": true,
      "snackbarMessage": `New Testrun added`
    })
    this.props.router.push('/');
  }

  // allows adding of testruns
  addTestrunCancel() {
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
     switch (location.pathname) {
       case '/':
        this.props.router.push('/addTestrun');
        break;
      default:
        this.props.router.push('/');
    }

  }

  handleCloseSnackbar() {
    this.setState({
      snackbarOpen: false,
    });
  }



  render() {
    const {snackbarOpen, snackbarMessage} = this.state
    const {location} = this.props

    let elRightLabel = ''
      , title = ''
    switch (location.pathname) {
      case '/':
        elRightLabel = 'Add Testrun'
        title = OVERVIEW_LABEL
        break;
      case '/addTestrun':
        title = ADDNEW_LABEL
        elRightLabel = 'Overview'
        break;
      default:
        title = DETAIl_LABEL
        elRightLabel = 'Overview'
    }


    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span style={styles.title}>{title}</span>}
            onRightIconButtonTouchTap={this.handleTouchAdd}
            iconElementRight={<FlatButton label={elRightLabel} />}
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
