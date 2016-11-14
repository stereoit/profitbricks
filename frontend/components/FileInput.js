import React, { Component } from 'react'

class FileInput extends Component {

  constructor(props) {
    super(props)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange(event) {
    console.log("event validation");
    // Verify that file is correct via the event
    // this.setValue(true);
    // Or if not valid
    this.setValue(false);
  }

  render() {
    return (
      <div>
        <h3>Select files </h3>
       <input type="file" id="file-select" name="tests[]" multiple/>
      </div>
    )
  }
}

export default FileInput
