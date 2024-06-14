"use client";

import { ethers } from "ethers"
import { useState, useEffect } from "react";
import axios from "axios";
import { nftaddress,nftmarketaddress } from "../../../config"
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"
import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

const MyAssets = () => {
  const [nfts,setNfts]=useState([])
  const [loadingState,setLoadingState] = useState("not-loaded") //check metamask wallet connected
  useEffect(()=>{
    loadNFTs()
  },[])
async function loadNFTs(){
  const web3Modal = new web3Modal;
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner()
//beginning no one connect to metamask
//after some time connect to metamask

const marketContract = new ethers.Contract(nftmarketaddress,NFTMarket.abi,signer)
const tokenContract = new ethers.Contract(nftaddress,NFT.abi.provider)

const data = await marketContract.fetchMyNFT()

const items = await Promise.all.map(async i=>{
  
})

}
  return (
    <div>myNFTs</div>
  )
}

export default MyAssets