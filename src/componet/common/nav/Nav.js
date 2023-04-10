import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";
import { Button } from "@chakra-ui/react";
import Web3 from 'web3';

function Nav() {
  const [clicked, setClicked] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('signing to quest');
  const [signature, setSignature] = useState('');
  const [walletConnectBtn, setwalletConnectBtn] = useState("Connect Wallet");
  const [xp, setxp] = useState(0)

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleWalletConnect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setWeb3(web3);
        setAddress(accounts[0]);
        await handleSignMessage();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSignMessage = async () => {
    const messageToSign = message.trim();
    if (web3 && address && messageToSign) {
      try {
        const signature = await web3.eth.personal.sign(messageToSign, address, '');
        setSignature(signature);
        sendSignedMessage(signature);
        console.log(signature);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const DISCORD_AUTH_URL = "https://discord.com/api/oauth2/authorize?client_id=1093225051781869668&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds%20email%20guilds.members.read"
  const discordValidator = async()=> {
      window.location = DISCORD_AUTH_URL; 
  }
  const sendSignedMessage = async (signature) => {
    setwalletConnectBtn(address.slice(0,5)+'...'+address.slice(-5))
    const apiUrl = 'http://31.220.48.246:4000/user/metamaskAuth';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature ,address}),
      });
      const responseData = await response.json();
      console.log(response);
      setxp(responseData.points);
      localStorage.setItem('jwtToken',responseData.token);
      localStorage.setItem('address',address);
      console.log(responseData);
      const t = localStorage.getItem('jwtToken');
      console.log(t);
    } catch (error) {
      console.error(error,"error from auth");
    }
  };

  return (
    <div className="startdivNav">
      <ul id="list" className={clicked ? "#list active" : "#list"}>
        <li>
          <NavLink to="/login" className="navbar">
            Set Up Quest
          </NavLink>
        </li>
        <li>
          <NavLink to="/MyQuest" className="navbar">
            Explore Quest
          </NavLink>
        </li>

        <li>
          <NavLink className="navbarBtn">
            {/* wallet connect used here */}
            {xp > 0 ? (
        <span>{xp}Xp</span>
      ) : (
        <span></span>
      )}
            <Button onClick={handleWalletConnect}>{walletConnectBtn}</Button>
            <Button onClick={discordValidator}>discord</Button>
            {/* wallet connect function from here */}
          </NavLink>
        </li>
      </ul>
      <div className="icon" onClick={handleClick}>
        <i id="bar" className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
    </div>
  );
}

export default Nav;
