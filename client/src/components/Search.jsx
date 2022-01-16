import React, { Component, useState } from "react";
import { ethers } from "ethers";
import axios from 'axios';
import { withAlert } from 'react-alert'

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
        <div className="flex gradient-bg-transactions">
            <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
                <div className="flex mf:flex-col flex-col items-center justify-between md:p-20 py-12 px-4">
                    <div className="flex-1 flex flex-col justify-start items-start">
                        <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
                            View all organization addresses
                        </h1>
                        <button onClick={this.searchUsers}>Search</button>
                    </div>
                    <ul>{orglist}</ul>
                </div>
                
                <div className="flex-1 flex flex-col justify-start items-start">
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
                </div>
                <ul>{articlelist}</ul>
            </div>
        </div>
      </div>
    );
  }
}
export default Search;