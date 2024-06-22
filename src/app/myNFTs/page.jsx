"use client";

import { ethers } from "ethers"
import Web3Modal from 'web3modal';
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
  const web3Modal = new Web3Modal;
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner()
  const connectAddress =await signer.getAddress()
  console.log("This is connected address : "+ connectAddress);
  //beginning no one connect to metamask
  //after some time connect to metamask
//   const marketABI = await NFTMarket.abi
// console.log("this is NFT : "+  JSON.stringify(NFT.abi, null, 2));
// console.log("this is NFTMarket : "+  JSON.stringify(NFTMarket.abi, null, 2));
// console.log("NFT address : "+nftaddress);
// console.log("Market address : "+nftmarketaddress);
  const marketContract = new ethers.Contract(nftmarketaddress,NFTMarket.abi,signer)

  //we do not need to sign becouse going to display
  const tokenContract = new ethers.Contract(nftaddress,NFT.abi,provider)

  const data = await marketContract.fetchMyNFT()

  const items = await Promise.all(data.map(async i =>{
    const tokenUri = await tokenContract.tokenURI(i.tokenId)
    const meta = await axios.get(tokenUri)
    console.log(meta)
    let price = ethers.utils.formatUnits(i.price.toString(),'ether')
    let item = {
      price,
      tokenId:i.tokenId.toNumber(),
      seller:i.seller,
      owner: i.owner,
      image: meta.data.image,
    }
    return item
  }))
  setNfts(items)
  setLoadingState('loaded')
}
if (loadingState === 'loaded' && !nfts.length)
  return (
    <h1 className="font-bold text-center ">No NFTs found.Buy some NFTs</h1>
  )
  return(
    <div className="flex justify-center">
      <div className="p-4">
          <div className="grid grid-cols-4 gap-5 pt-6">
            {
              nfts.map((nft,i) =>(
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                      <img className="rounded" height={30} src={nft.image} alt="nft image"/>
                      <h2 className="text-white">{nft.name}</h2>
                      <div className="p-4 bg-black">
                          <p className="text-x1 font-bold text-white">
                              Price : {nft.price} Eth
                          </p>
                      </div>
                </div>
              ))
            }
          </div>
      </div>

    </div>
  )
}

export default MyAssets