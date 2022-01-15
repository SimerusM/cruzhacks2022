import React, { Component, useState } from "react";
import axios from 'axios';


class Services extends Component {
  state = {
      selectedFile: null,
      hash: '',
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
    console.log('Image sent')
    axios.post('http://127.0.0.1:3001/image',fd,
        {headers: { 'Content-Type': 'multipart/form-data' }})
        .then(res => {
            console.log(res);
        })
  }

  onSubmit = (data) => {
    this.hash(data).then((hex) => console.log(hex));
    
    console.log(data)
  }

  hash = (string) => {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
      return hashHex;
    });

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

        <div className="flex w-full justify-center items-center gradient-bg-services">
          <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
            <div className="flex-1 flex flex-col justify-start items-start">
              <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                Publish articless
              </h1>
              <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                For publishers to publish headlines
              </p>
            </div>
          
            {/* <div className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer flex-1 flex flex-col justify-start items-center p-7">
              <button onClick={() => {console.log('hi')}}>Publish</button>
            </div> */}
            {/* <div className="items-center justify-between md:p-12 py-8 px-4">
              <input type="text"/>
            </div>  */}
            <form onSubmit={this.onSubmit()}>
              {/* <label>
                <input type="text" name="hash" />
              </label>
              <div className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer flex-1 flex flex-col justify-start items-center p-7">
                <button onClick={() => {console.log('hi')}}>Publish</button>
              </div> */}
              <input type="text" />
              <div className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer flex-1 flex flex-col justify-start items-center p-7">
                <input type="submit" />
              </div>
            </form>
            
          </div>

          <h1>{this.state.hash}</h1>
          <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
            <div className="flex-1 flex flex-col justify-start items-start">
              <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                Publish images
              </h1>
              <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                For publishers to publish images ...
              </p>
            </div>

            <div className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer flex-1 flex flex-col justify-start items-center p-7">
              <button onClick={this.fileUploadHandler}>Upload</button>
            </div>
            <div className="items-center justify-between md:p-12 py-8 px-4 text-white">
              <input type="file" onChange={this.fileSelectedHandler}></input>
            </div> 
          </div>
        </div>

        <button onClick={this.fileUploadHandler}>Upload</button>

      </div>
    );
  }
}
export default Services;