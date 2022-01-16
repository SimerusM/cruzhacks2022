import React, { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import {ethers} from 'ethers';
import axios from 'axios';

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          loggedin: false,
          name: '',
          address: ''
        }
    }

    getAddress = async () => {
        await window.ethereum.send('eth_requestAccounts');
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        let current_address = (await provider.listAccounts())[0];
        console.log(current_address);

        return current_address;
    }

    componentDidMount = async () => {
        let address = await this.getAddress();
        this.setState({ address: address });
        axios.get(`http://localhost:3001/api/getuser?address=${address}`)
            .then(res => {
                if (res.status === 200)
                    this.setState({
                        name: res.data.username,
                        loggedin: true
                    });
                else
                    this.setState({loggedin: false});
            });
    }
    
    // SIGN UP PART
    handleChangeSignup = event => {
         this.setState({ name: event.target.value });
         console.log(this.state.name);
     }
    
    handleSubmitSignup = async event => {
        event.preventDefault();

        const address = await this.getAddress();
        axios.post('http://localhost:3001/api/adduser', { address: address, name: this.state.name })
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        loggedin: true
                    });
                }
                else console.log("ERROR", res);
            });
    }

    render() {
        return this.state.loggedin ? (
            <div className="">
                <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                    
                    {/* Ethereum Card */}
                    <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                        <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism">
                            <div className="flex justify-between flex-col w-full h-full">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                        {/* ETH Logo */}
                                        <SiEthereum fontSize={25} color="#fff" />
                                    </div>
                                    <BsInfoCircle fontSize={17} color="#fff" />
                                </div>
                                <div>
                                    <p className="text-white font-light text-sm">
                                        Welcome back,
                                    </p>
                                    <p className="text-white font-semibold text-lg mt-1">
                                        { this.state.name }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
        :
        (
            <div>
                <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                    
                    {/* Ethereum Card */}
                    <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                        <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism">
                            <div className="flex justify-between flex-col w-full h-full">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                        {/* ETH Logo */}
                                        <SiEthereum fontSize={25} color="#fff" />
                                    </div>
                                    <BsInfoCircle fontSize={17} color="#fff" />
                                </div>
                                <div>
                                    <p className="text-white font-light text-sm">
                                        Built on Ethereum
                                    </p>
                                    <p className="text-white font-semibold text-lg mt-1">
                                        
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                            <h3 className="text-white text-3xl py-2 text-gradient ">
                                Sign up
                            </h3>
                            <form onSubmit={this.handleSubmitSignup} className="p-5 sm:w-96 w-full flex flex-col justify-start items-center">
                                <input placeholder="Name" name="address" onChange={this.handleChangeSignup} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"></input>
                                <div className="h-[1px] w-full bg-gray-400 my-2" />
                                <input type="submit" value="Sign up" className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );    
    }
}

export default Login;