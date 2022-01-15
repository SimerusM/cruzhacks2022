import React, { Component, useState } from "react";
import axios from 'axios';

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };
  }


  handleUpload = () => {
      console.log('Handle Upload')
      axios.post('http://127.0.0.1:3001/api/hashimage', { value: this.onImageChange.image })
  }

  // Changes the Image upon user choosing a new file
  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      this.setState({
        image: URL.createObjectURL(img)
      });
    }
  };

//   submit(event) {
//     fetch("http://127.0.0.1:3001/api/hashimage")
//         .then(response=> response.json())
//         .then(hash => this.setState({ hash }));
//     event.preventDefault();
//   }

  render() {
    return (
      <div>
        <div>
          <div>
            {/* Testing */}
            <div style={{ padding: "20px", background: "blue", color: "white"  }}>
                {/* Displaying Image onto screen */}
                {/* <img src={this.state.image} /> */}

                {/* Displaying URL of img onto screen */}
                <h1>{this.state.image}</h1>
            </div>
            
            <h1>Select Image</h1>
            <input type="file" name="myImage" onChange={this.onImageChange} />
            <button onClick={this.handleUpload}>Upload</button>
          </div>
        </div>
      </div>
    );
  }
}
export default Services;