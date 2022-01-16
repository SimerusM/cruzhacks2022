import React, { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import axios from 'axios';

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

class Login extends React.Component {

    constructor() {
        super()
        this.state = {
        // This is where the score is being saved
          address: '', login: true, name: ''
        }
    }
    
    // LOGIN PART
    handleChangeLogin = event => {
        this.setState({ address: event.target.value });
    }
    
    handleSubmitLogin = event => {
        event.preventDefault();
    
        const user = {
          address: this.state.address
        };
    
        axios.post(`/api/routes/getuser`, { user })
          .then(res => {
            console.log(res.status)
            console.log(res.data)
            if (res.status === '200') {

            } else if (res.status === '404') {
                this.setState({
                    login: !this.state.login
                })
                
            }
            // console.log(res);
            console.log(res.data);
          })
    }
    
    // SIGN UP PART
    // handleChangeSignup = event => {
    //     this.setState({ name: event.target.value });
    // }
    
    // handleSubmitSignup = event => {
    //     event.preventDefault();
    
    //     const user = {
    //       name: this.state.name
    //     };
    
    //     axios.post(`http://localhost:3001/api/routes/getuser`, { user })
    //       .then(res => {
    //         console.log(res)
    //         if (res === 200) {

    //         } else if (res === 404) {
    //             this.setState({
    //                 login: !this.state.login
    //             })
    //         }
    //         // console.log(res);
    //         console.log(res.data);
    //       })
    // }
    render() {
        const loginPage = this.state.login;
                        {/* Input Form */}
                        if (loginPage) {
                            return (
                                <div className="flex w-full justify-center items-center gradient-bg-welcome">
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
                                                            Address
                                                        </p>
                                                        <p className="text-white font-semibold text-lg mt-1">
                                                            Ethereum
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                                                <h3 className="text-white text-3xl py-2 text-gradient ">
                                                    Login
                                                </h3>
                                                <form onSubmit={this.handleSubmitLogin} className="p-5 sm:w-96 w-full flex flex-col justify-start items-center">
                                                    <input placeholder="Address" name="address" onChange={this.handleChangeLogin} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"></input>
                                                    <div className="h-[1px] w-full bg-gray-400 my-2" />
                                                    <input type="submit" value="Login" className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"/>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            );
                        } else {
                            return (
                                <div className="flex w-full justify-center items-center gradient-bg-welcome">
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
                                                            Address
                                                        </p>
                                                        <p className="text-white font-semibold text-lg mt-1">
                                                            Ethereum
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                                                <h3 className="text-white text-3xl py-2 text-gradient ">
                                                    Sign up
                                                </h3>
                                                <form onSubmit={this.handleSubmit} className="p-5 sm:w-96 w-full flex flex-col justify-start items-center">
                                                    <input placeholder="Address" name="address" onChange={this.handleChange} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"></input>
                                                    <input placeholder="Name" name="address" onChange={this.handleChange} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"></input>
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
}

export default Login;