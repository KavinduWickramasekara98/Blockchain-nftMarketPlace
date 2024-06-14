"use client";

import { ethers } from "ethers"
import { nftaddress,nftmarketaddress } from "../../../config"
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"
import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json"


import { useState, useRef } from "react";
import { useRouter } from "next/navigation"
import Web3Modal from 'web3modal'
import FormData from "form-data";
import axios from "axios";
require('dotenv').config()
export default function Home() {

  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formInput,updateFormInput] =useState({price:"",name:"",description:""})
  const [fileUrl,setFileUrl] = useState(null)
  const [imageUrl,setImageUrl] = useState(null)
  const inputFile = useRef(null);

  const FormData = require("form-data")
//as soon as NFT created push it to home page
  const router=useRouter()
  
  const uploadToPinata = async(file)=>{
    if (file) {
      try{
        setUploading(true);
        const formData = new FormData();
        formData.append("file",file);

        const res = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer "+process.env.NEXT_PUBLIC_PINATA_JWT,
            },
            body: formData,
          }
        );
        const data = await res.json();
        console.log("this is response : "+data.IpfsHash);
        
        //setCid(data.IpfsHash);
         //setImageUrl(`https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`)
        setFile(`https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`);
        setImageUrl(`ipfs://${data.IpfsHash}`)
        
        setUploading(false);
      }catch(e){
        setUploading(false);
        console.log("upload to Pinata "+e);
      }
    }
  }
   

  
  const handleChange = async (e) => {
    try {
      
      uploadToPinata(e.target.files[0]);
    } catch (error) {
      console.error("error "+error);
    }
    
    
  };

  async function createItem(){
    const {name,description,price}=formInput
    if(!name || !description || !price || !imageUrl) return;
  
    console.log("name : "+name +"/nDescription"+description+"/nPrice"+price);
    //create json string of data going to pass
    //use json format
    try {
      const data = JSON.stringify({
        pinataContent: {
          name: name,
          description: description,
          image: imageUrl,
          external_url: "https://pinata.cloud"
        },
        pinataMetadata: {
          name: "metadata.json"
        }
      })
      const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer "+process.env.NEXT_PUBLIC_PINATA_JWT,
        },
        body: data,
      });
      const resData = await res.json();
      console.log(resData);
      console.log("this is created NFT : "+resData.IpfsHash);
      
      //setCid(resData.IpfsHash);
      //setFileUrl(`https://gateway.pinata.cloud/ipfs/${cid}`)

      await createSale(fileUrl);

    } catch (e) {
      console.log('error uploading file : ',e)
    }
  }



  async function createSale(url){
    try{
    const web3Modal=new Web3Modal()
    const connection=await web3Modal.connect()
    const provider=new ethers.providers.Web3Provider(connection)
    const signer=provider.getSigner()
//nft contract related transaction
    let contract=new ethers.Contract(nftaddress,NFT.abi,signer)
    
    let transaction=await contract.createToken(url)
    let tx=await transaction.wait()
    let event=tx.events[0]  //get 0 index data from emit event
    let value=event.args[2] //get 2 index data from emit event
    let tokenId=value.toNumber()

    const price=ethers.utils.parseUnits(formInput.price,'ether')

    contract=new ethers.Contract(nftmarketaddress,NFTMarket.abi,signer)
    let listingPrice=await contract.getListingPrice()
    listingPrice=listingPrice.toString()

    //call NFT and get tokenId then create marketSale
    transaction=await contract.createMarketItem(nftaddress,tokenId,price,{value: listingPrice})
    await transaction.wait()
    }catch(e){
      console.log("create sale function error "+e);
    }
    router.push('/')
  }

//get image file get url and set useState
 

  return(
    
    //convert in to meta data
    //publish data to ipfs
    //mint NFTs
    //read event from blockchain catch backend and send it to U

    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
          <input 
          placeholder="Enter NFT name" 
          className="mt-8 border rounded p-4"
          onChange={e=>updateFormInput({...formInput,name:e.target.value})}
          />
          <textarea
          placeholder="Enter NFT description"
          className="mt-2 border rounded p-4"
          onChange={e=>updateFormInput({...formInput,description:e.target.value})}

          />

          <input
          placeholder="Enter NFT price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e=>updateFormInput({...formInput,price:e.target.value})}
          />

          {/* <input 
          type="file"
          name="asset"
          className="my-3"
          onChange={onChange}
          /> */}
          <input className="my-3" type="file" id="file" ref={inputFile} onChange={handleChange} />
          {
            imageUrl && (
              <img className="rounded mt-4" height={350} src={file} alt="nft"/>
            )
          }
          
      <button disabled={uploading} onClick={async() => await createItem()} className="font-bold mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:to-yellow-500 text-white rounded pd-7 shadow-lg ">
        {uploading ? "Uploading NFT" : " Create NFT"}
      </button>
         
      </div>
    </div>
  )
}
