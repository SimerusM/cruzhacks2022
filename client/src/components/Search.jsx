import React, { Component, useState } from "react";
import { ethers } from "ethers";
import axios from 'axios';
import { withAlert } from 'react-alert';
import { Loader } from ".";

const SearchCard = ({ color, title, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      <img src={"https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-18.png"}></img>
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sentiment: 0,
      category: '',
      publisherAddress: null,
      articles: [],
      orgs: []
    };
  }

  searchUsers = async () => {
    let res = await axios.get('http://127.0.0.1:3001/api/users');
    console.log(res.data);
    this.setState({ orgs: res.data });
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

  categoryOnChange = (event) => {
    let category = event.target.value;
    this.setState({ category: category });
  }

  sentimentOnChange = (event) => {
    let sentiment = event.target.value;
    this.setState({ sentiment: sentiment });
  }

  searchArticles = async () => {
    if (this.state.publisherAddress && (this.state.category || this.state.sentiment)) {
        let res = await axios.post(
            'http://127.0.0.1:3001/api/getarticles',
            {
                publisher: this.state.publisherAddress,
                sentiment: this.state.sentiment,
                category: this.state.category
            }
        );
        console.log(res.data);
        this.setState({articles: res.data});
    }
  }

  render() {
    let org, art;
    const orglist = this.state.orgs.map((org) => <li key={org.username}>{org.username}: {org.id}</li>);
    const articlelist = this.state.articles.map((art) => <li key={art.title}>{art.title}: {art.owner}</li>);
    return (
      <div>
        <div className="flex w-full justify-center items-center gradient-bg-search">
            <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
                <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
                    <div className="flex-1 flex flex-col items-center justify-start items-start">
                        <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                            View all organization addresses
                        </h1>
                        <button onClick={this.searchUsers} className="flex w-full text-white flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]">Search</button>
                    </div>

                    <div className="flex-1 flex flex-col justify-start items-center test-white">
                      <SearchCard
                        color=""
                        title="Organizations"
                        subtitle={orglist}
                      />
                    </div>
                    {/* <div className="bg-[#181918] m-4 flex-col p-3 rounded-md hover: shadow-2xl">
                    <ul>{orglist}</ul>
                    </div> */}
                    
                </div>
                
                <h1 className="text-white py-7 text-3xl sm:text-5xl py-2 text-gradient ">
                  Enter search options
                </h1>
                <div className="p-7 my-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                  <h3 className="text-white text-3xl py-2 text-gradient ">
                      Options
                  </h3>
                  <input placeholder="Enter publisher address" type="text" name="address" onChange={this.addressOnChange} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"/>
                  <input type="text" placeholder="Enter a category (optional)" name="category" onChange={this.categoryOnChange} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"/>
                  <p className="text-gradient text-center my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                    Select a sentiment
                  </p>
                  <div onChange={this.sentimentOnChange}>
                    <input type="radio" value="1" name="sentiment"/><label className="text-white font-light px-2">Positive</label><br/>
                    <input type="radio" value="-1" name="sentiment" /><label className="text-white font-light px-2">Negative</label>
                  </div>
                  <div className="h-[1px] w-full bg-gray-400 my-2"/>
                      {false
                      ? (<Loader />)
                      : (
                      <button
                        type="submit"
                        onClick={this.searchArticles}
                        className="text-white w-full mt-2 border-[1px] p-3 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                      >
                        Search
                      </button>
                      )}
                </div>  
                <div className="flex-1 flex flex-col items-center justify-start items-start">
                        <h3 className="text-white text-3xl py-2 text-gradient ">
                            Search option results
                        </h3>
                    </div>
                
                {/* <div className="flex-1 flex flex-col justify-start items-start">
                    <p className="text-center my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                        Enter the publisher address
                    </p>
                </div>
                <input type="text" name="address" onChange={this.addressOnChange}/>

                <div className="flex-1 flex flex-col justify-start items-start">
                    <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                        Enter search options
                    </h1>
                    <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                        Enter a category
                    </p>
                    <input type="text" placeholder="Optional" name="category" onChange={this.categoryOnChange}/>
                    <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
                        Select a sentiment
                    </p>
                    <div onChange={this.sentimentOnChange}>
                        <input type="radio" value="1" name="sentiment" /><label>Positive</label><br/>
                        <input type="radio" value="-1" name="sentiment" /><label>Negative</label>
                    </div>
                    <button onClick={this.searchArticles}>Search</button>
                </div> */}
                <div className="flex-1 flex flex-col justify-start items-center test-white">
                      <SearchCard
                        color=""
                        title="Results"
                        subtitle={articlelist}
                      />
                </div>
                {/* <ul>{articlelist}</ul> */}
            </div>
        </div>
      </div>
    );
  }
}
export default Search;