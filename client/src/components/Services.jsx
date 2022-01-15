import React, { Component, useState } from "react";
import axios from 'axios';

class Services extends Component {
  state = {
      selectedFile: null
  }

  fileSelectedHandler = event => {
      this.setState(
          {selectedFile: event.target.files[0]}
      )
    //   Debug
    console.log(event.target.files[0])
  }

  fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('image', this.state.selectedFile, this.state.selectedFile.name)
    console.log(fd.get('image'));
    axios.post(
      'http://127.0.0.1:3001/api/hashimage',
      fd,
      {headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {console.log(res);})
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.fileSelectedHandler}></input>
        <button onClick={this.fileUploadHandler}>Upload</button>
      </div>
    );
  }
}
export default Services;