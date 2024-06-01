import { ethers } from "ethers"
import { useState } from "react"
import {create as ipfsHttpClient} from 'ipfs-http-client'

//route ekakin wena ekakta data push
import { useRouter } from "next/router"
import Web3Modal from 'web3modal'
const {create}=require('ipfs-http-client')
const projectId ="66c694bcd0224c209b8298510f76b13c";
const projectSecret = "eFaU7Z0Y/L7ST3fn8gxVJGqG0KcrGjI4ZW4h36t9WBEZWly43TP0qQ";

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
  
  client.pin.add("QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn").then((res) => {
    console.log(res);
  });
  const Page = () => {
  return (
    <div>createNFT</div>
  )
}

export default Page
