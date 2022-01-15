import React, { Component, useState } from "react";
import axios from 'axios';

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imagesrc: null
    };
  }

  fileSelectedHandler = event => {
    if (event.target.files && event.target.files[0])
      this.setState({
        selectedFile: event.target.files[0],
        imagesrc: URL.createObjectURL(event.target.files[0])
      });
    else
      this.setState({
        selectedFile: null,
        imagesrc: null
      });
  
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
        <img src={this.state.imagesrc} />
        <input type="file" onChange={this.fileSelectedHandler}></input>
        <button onClick={this.fileUploadHandler}>Upload</button>
      </div>
    );
  }
}
export default Services;