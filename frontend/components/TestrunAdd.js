import React, {Component} from 'react';
import Formsy from 'formsy-react';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
  FormsySelect, FormsyText, FormsyTime, FormsyToggle } from 'formsy-material-ui/lib';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';



class TestrunAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {"canSubmit": false}
    this.submit = this.submit.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.enableButton = this.enableButton.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
  }

  enableButton() {
    this.setState({
      canSubmit: true
    });
  }

  disableButton() {
    this.setState({
      canSubmit: false
    });
  }

  submit(model) {
    // console.log("onAddTestrun with ", model);
    let {onAddTestrun} = this.props
    onAddTestrun(model)
  }

  formSubmit() {
    this.refs.form.submit(); // Point directly to the form component
  }

  render() {
    const {onAddTestrunCancel} = this.props
    return (
      <Card>
        <CardTitle title="New Testrun" subtitle="Fill in the details" />
        <CardText>
          <Formsy.Form ref="form" onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <FormsyText
            name="username"
            validations="isWords"
            validationError={"Please only use letters"}
            required
            hintText="Requester"
            floatingLabelText="username"
          />
        </Formsy.Form>
        </CardText>
        <CardActions>
          <FlatButton disabled={!this.state.canSubmit} onClick={this.formSubmit} label="Save"/>
          <FlatButton onClick={onAddTestrunCancel} label="Cancel"/>
        </CardActions>
      </Card>
    );
  }
}

export default TestrunAdd
