import React, { Component, useState } from "react";
import { ethers } from "ethers";
import axios from 'axios';
import { Loader } from ".";

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, onChange }) => (
    <input
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      step="0.0001"
      value={value}
      name={value}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);

class Publish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      imagesrc: null,
      articleTitle: '',
      isLoading: false
    };
  }

  getContract = async () => {
    await window.ethereum.send('eth_requestAccounts');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let address = (await axios.get('http://127.0.0.1:3001/api/contract/address')).data["address"];
    let abi = (await axios.get('http://127.0.0.1:3001/api/contract/abi')).data;

    console.log(address); console.log(abi);

    const contract = new ethers.Contract(address, abi, signer);
    return contract;
  }

  addImageHash = (imageHash) => {
    let num = ethers.BigNumber.from('0x' + imageHash);
    this.getContract()
      .then(contract => contract.addImage(num));
  }

  addArticleHash = (articleHash) => {
    let num = ethers.BigNumber.from('0x' + articleHash);
    this.getContract()
      .then(contract => contract.addArticle(num));
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
    if (this.state.selectedFile) {
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
        .then(hex => this.addImageHash(hex));
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
    if (this.state.articleTitle) {
      console.log(this.state.articleTitle);
      this.hash(this.state.articleTitle)
        .then(hex => {console.log(hex); return hex;})
        .then(hex => this.addArticleHash(hex));
      
      event.preventDefault();
    }
  }

  render() {
    return (
      <div>
        <div className="flex w-full justify-center items-center gradient-bg-services">
          <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
            <div className="flex-1 flex flex-col justify-start items-start">
            </div>

            {/* Publishing Article */}
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                <h3 className="text-white text-3xl py-2 text-gradient ">
                    Publish articles
                </h3>
                <Input placeholder="Article Name" name="article" type="text" onChange={this.articleOnChange} />
                <div className="h-[1px] w-full bg-gray-400 my-2"/>
                    {this.state.isLoading
                     ? (<Loader />)
                     : (
                     <button
                       type="submit"
                       onClick={() => this.articleOnSubmit(Input.name)}
                       className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                     >
                       Send now
                     </button>
                    )}

            </div>
            {/* </div> */}
          
                


          <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
            <div className="flex-1 flex flex-col justify-start items-start">
              <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                Publish images
              </h1>
              <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                Upload your image
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
    </div>
    );
  }
}
export default Publish;





