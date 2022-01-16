import React, { Component, useState } from "react";
import { ethers } from "ethers";
import axios from 'axios';
import { withAlert } from 'react-alert'

class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imagesrc: null,
      articleTitle: '',
      publisherAddress: null
    };
  }

  getContract = async () => {
    await window.ethereum.send('eth_requestAccounts');
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    let address = (await axios.get('http://127.0.0.1:3001/api/contract/address')).data["address"];
    let abi = (await axios.get('http://127.0.0.1:3001/api/contract/abi')).data;

    console.log(address); console.log(abi);

    const contract = new ethers.Contract(address, abi, provider);
    return contract;
  }

  checkImageHash = (publisherAddress, imageHash) => {
    let num = ethers.BigNumber.from('0x' + imageHash);
    //let num = '0x' + imageHash;
    let alert = this.props.alert;
    console.log(publisherAddress, num);
    this.getContract()
      .then(contract => contract.checkImage(publisherAddress, num))
      .then(valid => {
        console.log(valid);
        if (valid)
          alert.show("Image is verified!");
        else
          alert.show("Warning: image not verified.")
      })
      .catch(err => {console.log(err);});
  }

  checkArticleHash = (publisherAddress, articleHash) => {
    let num = ethers.BigNumber.from('0x' + articleHash);
    //let num = '0x' + articleHash;
    let alert = this.props.alert;
    console.log(publisherAddress, num);
    this.getContract()
      .then(contract => contract.checkArticle(publisherAddress, num))
      .then(valid => {
        console.log(valid);
        if (valid)
          alert.show("Article is verified!");
        else
          alert.show("Warning: article not verified.")
      })
      .catch(err => {console.log(err);});
  }



  fileSelectedHandler = (event) => {
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

  fileUploadHandler = async () => {
    if (this.state.selectedFile && this.state.publisherAddress) {
      const fd = new FormData();
      fd.append('image', this.state.selectedFile)
      console.log(fd.get('image'));
      axios.post(
        'http://127.0.0.1:3001/api/hashimage',
        fd,
        {headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(res => res.data)
        .then(hex => {console.log(hex); return hex;})
        .then(hex => this.checkImageHash(this.state.publisherAddress, hex));
    }
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

  articleOnChange = (event) => {
    let title = event.target.value;
    this.setState({ articleTitle: title.toLowerCase() });
  }

  articleOnSubmit = (event) => {
    event.preventDefault();
    if (this.state.articleTitle && this.state.publisherAddress) {
      console.log(this.state.articleTitle);
      this.hash(this.state.articleTitle)
        .then(hex => {console.log(hex); return hex;})
        .then(hex => this.checkArticleHash(this.state.publisherAddress, hex));
      
    }
  }

  addressOnChange = (event) => {
    let address = event.target.value;
    this.setState({ publisherAddress: address });
  }

  render() {
    return (
      <div>
        <div className="flex gradient-bg-transactions">
            <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
                <div className="flex-1 flex flex-col justify-start items-start">
                <p className="text-center my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                    Enter the publisher address
                </p>
                </div>
                <input type="text" name="address" onChange={this.addressOnChange}/>
                
            </div>

            <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
                <div className="flex-1 flex flex-col justify-start items-start">
                <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                    Verify articles
                </h1>
                <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                    Enter the article title
                </p>
                </div>

                
                <form onSubmit={this.articleOnSubmit}>
                <input type="text" name="article" onChange={this.articleOnChange}/>
                <div className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer flex-1 flex flex-col justify-start items-center p-7">
                    <input type="submit"/>
                </div>
                </form>
                
            </div>

            <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
                <div className="flex-1 flex flex-col justify-start items-start">
                <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                    Verify images
                </h1>
                <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                    Upload the image
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

      </div>
    );
  }
}
export default withAlert()(Verify);