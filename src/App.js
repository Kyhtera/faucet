import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import FaucetAbi from "./abis/faucet.json";
import Swal from 'sweetalert2';


const faucetContractAddress = "0xcF58258A2a47a5B4Fd8EAAABC44833FA35E25477"
function App() {

  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {
    connectWallet();
  }, [walletAddress]);


  const connectWallet = async () => {
    if (typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts");

        setProvider(provider);
        setWalletAddress(accounts[0]);

      } catch (err) {
        console.log(err);
      }
    }
  }

  const getTokens = async () => {
    try {
      const contract = new ethers.Contract(faucetContractAddress, FaucetAbi, provider.getSigner());//kendi faucet adresimiz ile değiştireceğiz. 1. contrat adres 2.abi 3-Provider 
      const transaction = await contract.requestToken();

      if (transaction.hash) {
        Swal.fire({
          title: 'Succes!',
          html:
            `Check transfer hash,
            < a href = "https://sepolia.etherscan.io/tx/ ${transaction.hash}" target = "_blank">Etherscan TX Hash`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
      }

    } catch (err) {
      console.log("error", err);
      Swal.fire({
        title: 'Error!',
        text: "Are You Sure?",
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }







  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">MyToken (MTK) Faucet</h1>
          </div>
          <div id="navbar-menu" className="navbar-menu">
            <div className="navbar-end">
              <button className="button is-white connect-wallet" onClick={connectWallet}>

                {walletAddress ? `Connected: ${walletAddress.substring(0, 6)}... ${walletAddress.substring(38)}` : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className='hero'>
        <div className='faucet-hero-body'>
          <div className='box'>
            <input
              type="text"
              className="input"
              placeholder='Enter your wallet address (0x....)'
              defaultValue={walletAddress}
            />
            <button className='button' onClick={getTokens}>Get Tokens</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;