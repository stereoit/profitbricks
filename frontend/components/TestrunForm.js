import React, { PropTypes } from 'react'

class TesrunForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      'uploading': false,
      'errors': []
    }
    this.submitForm = this.submitForm.bind(this)
  }

  submitForm(e) {
    e.preventDefault()
    console.log("Form submitting.", this.form.action);
    let {onAddTestrun} = this.props

    // Get the selected files from the input.
    let files = this.fileSelect.files

    // Create a new FormData object.
    let formData = new FormData();

    let errors = []
      , form = this.form
      , username = this.usernameInput.value

    if (username.length == 0) {
      errors.push("Username must not be empty")
    } else {
      formData.append('username', username)
    }

    // Loop through each of the selected files.
    let realCount = 0
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      // Check the file type.
      if (!file.name.match('.py$')) {
        console.log(`Only pythons allowed here! [${file.name}]`);
        continue;
      }
      realCount++;

      // Add the file to the request.
      formData.append('files[]', file, file.name);
    }
    if (realCount == 0) {
      errors.push("Must have at least one python test file selected.");
    }

    // show errors if any
    if (errors.length) {
      this.setState({errors: errors})
      return
    }

    // Set up the request.
    var xhr = new XMLHttpRequest();

    // Open the connection.
    xhr.open('POST', form.action, true);

    // Set up a handler for when the request finishes.
    xhr.onload = function () {
      if (xhr.status === 200) {
        // File(s) uploaded.
        console.log("Form data uploaded");
        onAddTestrun()
      } else {
        alert('An error occurred!');
      }
    };

    // Send the Data.
    xhr.send(formData);
  }

  render () {
    const {uploading, errors} = this.state
    if (uploading) {
      return  <div>uploading...</div>
    }
    let errorList = errors.length ?
      <ul className="errors">
        {errors.map( (error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      :
      null
    return (
      <form
        id="file-form"
        action="/newTestrun"
        method="POST"
        onSubmit={this.submitForm}
        ref={(form) => this.form = form}
      >
        {errorList}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          ref={(input) => this.usernameInput = input}
        /><br/>

        <label htmlFor="test-files">Tests to run</label>
        <input
          type="file"
          id="test-files"
          name="tests[]"
          ref={(input) => this.fileSelect = input}
          multiple
        /><br/>

        <button type="submit" id="upload-button">Upload</button>
      </form>
    )
  }
}

export default TesrunForm;
