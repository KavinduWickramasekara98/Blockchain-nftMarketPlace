 "use client"
import { ethers } from "ethers"
import { useState } from "react"
import { nftaddress,nftmarketaddress } from "../../../config"
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"
import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import {create as ipfsHttpClient} from 'ipfs-http-client'

//route ekakin wena ekakta data push
import { useRouter } from "next/navigation"
//import { useRouter } from "next/router"

import Web3Modal from 'web3modal'
const ipfsClient=require('ipfs-http-client')
const {create}=require('ipfs-http-client')
const projectId ="66c694bcd0224c209b8298510f76b13c";
const projectSecret = "eFaU7Z0Y/L7ST3fn8gxVJGqG0KcrGjI4ZW4h36t9WBEZWly43TP0qQ";

//infura +ipfs autorization, alchemy wala wena paramaeter wennathi
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  
  // client.pin.add("QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn").then((res) => {
  //   console.log(res);
  // });

  //take price,image,name,description from UI-user
  //meta data
  const CreateItem = () => {
    //*Take Inputs from form
    //get file location of PC
    const [fileUrl,setFileUrl] = useState(null)
    const [formInput,updateFormInput] =useState({price:"",name:"",description:""})
    
    //using router.push(where to push)
    const router=useRouter()

    //set to button , find image in pc,brows
    async function onChange(e){
      
        const files = e.target.files;
        if (files.length === 0) {
          console.log("FILE IS EMPTY");
          // Handle no file selected case (optional)
          return;
        }
        const file = files[0];
        console.log("FILE length "+files.length);
        // Safely access the first file (file[0])
        // ... rest of your code using the file
    
      try{
        //go to auth infura,upload ipfs and pin(for avoid garbage collecting)
        const added = await client.add(
          file,{
            //show UI how much of file uploaded
            progress:(prog)=>console.log(`received:${prog}`)
          }
        )
        //added.path = CID of image = image's ipfs path
        const url=`https://ipfs.infura.io:5001/${added.path}`
        //update setFileUrl State
        setFileUrl(url)

        //if anything is wrong
      }catch(e){
        console.log("error uploading file , please try again :"+e);
      }
    }
    
  async function createItem(){
    const {name,description,price}=formInput
    if(!name || !description || !price || !fileUrl) return;
  
    console.log("name : "+name +"/nDescription"+description+"/nPrice"+price);
    //create json string of data going to pass
    //use json format
    const data = JSON.stringify({
      name,description,image:fileUrl
    })
    try {
      //pin to ipfs
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createSale(url);
    } catch (e) {
      console.log('error uploading file : ',error)
    }
  }
  async function createSale(url)
  {
    //same as buyNFT
    const web3modal  = new Web3Modal()
    const connection = await web3modal.connect()
    //connect metamask using web3model
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()

    //sign into nft smart contract  
    let contract1 = new ethers.Contract(nftaddress,NFT.abi,signer)

    //above everything is done for get below one
    //need a tokenURI for paramaeter in nft.sol
    let transaction = await contract1.createToken(url)
    //async take data
    let tx=await transaction.wait()
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId=value.toNumber();//convert string to number type
    const price = ethers.utils.parseUnits(formInput.price,'ether');

    //get commition for listing one NFT
    let contract2 = new ethers.Contract(nftmarketaddress,NFTMarket.abi,signer);
    let listingPrice = new contract2.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction= await contract2.createMarketItem(nftaddress,tokenId,price,{value:listingPrice})
    await transaction.wait()
    // let transaction2 = await contract2.createMarketItem(nftaddress,tokenId,price,{value:listingPrice})
    // await transaction2.wait()

    //after create nft we can push it to main page
    router.push('/');
  }

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

          <input 
          type="file"
          name="asset"
          className="my-3"
          onChange={onChange}
          />

          {
            fileUrl && (
              <img className="rounded mt-4" width="350" src={fileUrl} />
            )
          }
          <button onClick={createItem} className="font-bold mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:to-yellow-500 text-white rounded pd-7 shadow-lg ">
            Create NFT
          </button>
      </div>
    </div>
  )
}

//any field is black return back

export default CreateItem


////////////////////////////////////////////////////////////////////////////

// import {useState} from 'react'
// import {ethers} from 'ethers'
// import {create as ipfsHttpClient} from 'ipfs-http-client'
// import {useRouter} from 'next/navigation'
// import Web3Modal from'web3modal'

// const {create} =require('ipfs-http-client')

// const projectId ="66c694bcd0224c209b8298510f76b13c";
// const projectSecret = "eFaU7Z0Y/L7ST3fn8gxVJGqG0KcrGjI4ZW4h36t9WBEZWly43TP0qQ";
// const auth= "Basic " + Buffer.from(projectId + ":" +projectSecret).toString("base64");
// const client =create({
//   host: "ipfs.infura.io",
//   port:5001,
//   protocol:"https",
//   headers:{
//   authorization:auth
//   },
// });

// import {
//   nftaddress,nftmarketaddress
// } from "../../../config"

// import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"
// import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

// export default function CreateItem(){
//   const [fileUrl,setFileUrl] = useState(null)
//   const [formInput,updateFormInput]=useState({price:"",name:"",description:""})

//   const router=useRouter()
  
//   async function onChange(e){
//     const file=e.target.files[0]
//     try{
//       const added=await client.add(
//         file,{
//           progress:(prog)=>console.log(`received:${prog}`)
//         }
//       )
//       const url=`https://ineuron-nft.infura-ipfs.io/ipfs/${added.path}`
//       setFileUrl(url)
//     }catch(error){
//       console.log("error uploading file, please try again:" ,error)
//     }
//   }

//   async function CreateMarket(){
//     const {name,description,price}=formInput
//     if(!name||!description||!price||!fileUrl) return

//     const data=JSON.stringify({
//       name,description,image:fileUrl
//     })
//     try{
//       const added=await client.add(data)
//       const url=`https://ineuron-nft.infura-ipfs.io/ipfs/${added.path}`
//       console.log(url)
//       createSale(url)
//     }catch(error){
//       console.log('error uploading file:',error)
//     }
//   }

//   async function createSale(url){
//     const web3Modal=new Web3Modal()
//     const connection=await web3Modal.connect()
//     const provider=new ethers.providers.Web3Provider(connection)
//     const signer=provider.getSigner()

//     let contract=new ethers.Contract(nftaddress,NFT.abi,signer)
//     let transaction=await contract.createToken(url)
//     let tx=await transaction.wait()
//     let event=tx.events[0]
//     let value=event.args[2]
//     let tokenId=value.toNumber()

//     const price=ethers.utils.parseUnits(formInput.price,'ether')

//     contract=new ethers.Contract(nftmarketaddress,NFTMarket.abi,signer)
//     let listingPrice=await contract.getListingPrice()
//     listingPrice=listingPrice.toString()

//     transaction=await contract.createMarketItem(nftaddress,tokenId,price,{value: listingPrice})
//     await transaction.wait()
//     router.push('/')
//   }

//   return(
//     <div className="flex justify-center">
//       <div className="w-1/2 flex flex-col pb-12">
//         <input placeholder="NFT Name"
//         className="mt-8 border rounded p-4"
//         onChange={e => updateFormInput({...formInput,name:e.target.value})}/>

//         <textarea 
//         placeholder="NFT Description"
//         className="mt-2 border rounded p-4"
//         onChange={e => updateFormInput({...formInput,description:e.target.value})}/>


//         <input
//         placeholder="NFT price in ETH"
//         className="mt-2 border rounded p-4"
//         onChange={e => updateFormInput({...formInput,price:e.target.value})}/>

//         <input
//         type="file"
//         name="asset"
//         className="my-3"
//         onChange={onChange}/>

//         {
//           fileUrl &&(
//             <img className="rounded mt-4" width="350" src={fileUrl} />
//           )
//         }
//         <button onClick={CreateMarket} className="font-bold mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white rounded p-4 shadow-lg">
//           Create NFT
//         </button>
//       </div>
//     </div>
//   )

// };